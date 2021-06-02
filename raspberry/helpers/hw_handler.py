import time
import RPI.GPIO as GPIO

class HWHandler:
    def init(self, relayPin):
        self.RELAY = relayPin
        self.doorStatus = False
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(RELAY, GPIO.OUT)
        GPIO.output(RELAY,GPIO.LOW)
    
    def lock(self):
        GPIO.output(RELAY,GPIO.HIGH)
        prevTime = time.time()
        print(f"\n[INFO]-Door has been opend at {prevTime}")
        self.doorStatus = True
        return self.doorStatus
    
    def lock(self):
        _currentTime = time.time()
        if doorLock == True and ( _currentTime - prevTime ) > 5:
            print(f"\n[INFO]-Lock The door at {_currentTime}")
        self.doorStatus = False
        return self.doorStatus