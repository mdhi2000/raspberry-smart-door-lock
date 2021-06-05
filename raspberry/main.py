import sys
import time
import face_recognition
import cv2
import numpy as np
import socketio
import RPi.GPIO as GPIO
from time import sleep
import glob
import re

RELAY = 17
BUTTON = 23
prevTime = 0


class Imageprocessing:
    def __init__(self, known_face_encodings, known_face_names):
        self.video_capture = None
        self.known_face_encodings = known_face_encodings
        self.known_face_names = known_face_names
        self.face_locations = []
        self.face_encodings = []
        self.face_names = []
        self.process_this_frame = True

    def unlock(self):
        GPIO.output(RELAY, GPIO.LOW)
        prevTime = time.time()
        print(f"\nDoor opened at {prevTime}")
        return True

    def lock(self):
        _currentTime = time.time()
        if (_currentTime - prevTime) > 1:
            GPIO.output(RELAY, GPIO.HIGH)
            print(f"\nDoor locked at {_currentTime}")
            return False

    def process(self):
        print('\nprocessing')
        self.video_capture = cv2.VideoCapture(0)
        for i in range(30):
            print('\nTaking image')
            ret, frame = self.video_capture.read()
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = small_frame[:, :, ::-1]
            if self.process_this_frame:
                self.face_locations = face_recognition.face_locations(
                    rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(
                    rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    matches = face_recognition.compare_faces(
                        self.known_face_encodings, face_encoding)
                    name = None

                    face_distances = face_recognition.face_distance(
                        self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
                    if name != None:
                        self.face_names.append(name)

            if self.face_names != []:
                print(f"\ndetected face: {name}")
                #io.emit('detected_faces', {'names': face_names})
                doorLock = self.unlock()
                sleep(3)
                self.lock()
                self.video_capture.release()
                return
            if i == 29:
                print("\nNo face detected")
                self.video_capture.release()
                return
            sleep(0.5)


def main():
    print('initializing...\n')
    images_path = glob.glob('./images/*.*')
    known_face_encodings = []
    known_face_names = []

    for image_path in images_path:
        loaded_image = face_recognition.load_image_file(image_path)
        loaded_face_encoding = face_recognition.face_encodings(loaded_image)[0]
        known_face_encodings.append(loaded_face_encoding)
        image_name = re.findall(r"^./images/(.*)\..*$", image_path)[0]
        known_face_names.append(image_name)

    print(known_face_names)

    imageProcessing = Imageprocessing(known_face_encodings, known_face_names)

    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(RELAY, GPIO.OUT)
    GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.output(RELAY, GPIO.HIGH)

    print(f"\nApp is now running\n\nPress the button to trigger face recognation process")

    while True:
        if GPIO.input(BUTTON) == GPIO.HIGH:
            print('\nButton pressed')
            imageProcessing.process()


if __name__ == '__main__':
    try:
        main()
    except:
        GPIO.cleanup()
        cv2.destroyAllWindows()
