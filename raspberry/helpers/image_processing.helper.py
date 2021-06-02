
import face_recognition
import cv2

class ImageProcessing:
    def init(self, userNames, imagePath, cvVideoCapture):
        self.userNames = userNames
        self.imagePath = imagePath
        self.cvVideoCapture = cvVideoCapture
        self.userImage = self._loadImage(imagePath)
        self.userImageEncoding = self._faceEncoder(self.userImage)
        self._variablesDefinition(self, self.userImageEncoding)

    def _variablesDefinition(self, userImageEncoding):
        self.face_locations = []
        self.face_encodings = []
        self.frameProcess = True
        self.usersFacesEncoding = [userImageEncoding]

    def _loadImage(imagePath):
        userImage = face_recognition.load_image_file(
        "image_path")
        return userImage

    def _faceEncoder(userImage):
        userImageEncodeing = face_recognition.face_encodings(userImage)[0]
        return userImageEncodeing

    def loopHelper(self):
        self.ret, self.frame = self.cvVideoCapture.read()
        self.small_frame =  cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        self.rgb_small_frame = small_frame[:, :, ::-1]
        if self.frameProcess:
            

    def _nameChecker(self):
        if self.frameProcess:

