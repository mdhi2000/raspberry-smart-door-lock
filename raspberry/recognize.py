#!/usr/bin/python3
import sys
import time
import face_recognition
import cv2
import numpy as np
import socketio
import RPI.GPIO as GPIO


#   definitions
video_capture = cv2.VideoCapture(0)
#*      Load a sample picture and learn how to recognize it.
mohammad_image = face_recognition.load_image_file(
    "image_path")
mohammad_face_encoding = face_recognition.face_encodings(mohammad_image)[0]
#*      Create arrays of known face encodings and their names
known_face_encodings = [
    mohammad_face_encoding
]
known_face_names = [
    "Mohammad"
]
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True
#*      Hardware definitions
RELAY = 17
doorLock = False
prevTime = 0 #**the lask time that lock was open (type=Time)
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY, GPIO.OUT)
GPIO.output(RELAY,GPIO.LOW)
#*      Application
_dev = False

# Application parameters logic
if len(sys.argv[1]):
    _dev = True
    print(f"\n[INFO]-Run {sys.argv[0]} application on develop mode")


# connection
io = socketio.Client(reconnection=True, logger=True)
io.connect('http://localhost:8001')
if _dev:
    print(io.emit('\n[INFO]-raspberry_connect', {'SerialNumber': '12345'}))

# Helper functions
def unlock():
    if doorLock == False:
        GPIO.output(RELAY,GPIO.HIGH)
        prevTime = time.time()
        if _dev:
            print(f"\n[INFO]-Door has been opend at {prevTime}")
        return True
    else:
        if _dev:
            print(f"\n[WARN]-Door is open (unlock)")


def lock():
    _currentTime = time.time()
    if doorLock == True and ( _currentTime - prevTime ) > 5:
        if _dev:
            print(f"\n[INFO]-Lock The door at {_currentTime}")
        return False
    else:
        if _dev:
            print(f"\n[WARN]-Door is open (lock)")


while True:
    doorLock = lock()
    #   video formatting 
    #*      Grab a single frame of video
    ret, frame = video_capture.read()
    #*      Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    #*      Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]
    #*      Only process every other frame of video to save time
    if process_this_frame:
        #*      Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(
            rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            #*      See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(
                known_face_encodings, face_encoding)
            name = "Unknown"

            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(
                known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]

            face_names.append(name)

    process_this_frame = not process_this_frame

    if face_names != []:
        if _dev:
            print("\n[INFO]-Fire io emit: detected_face")
        io.emit('detected_faces', {'names': face_names})
        doorLock = unlock()

        
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()


