from win32 import win32crypt
from pyaes.pyaes import AESModeOfOperationGCM
import argparse
import base64

parser = argparse.ArgumentParser()

parser.add_argument('--token')
parser.add_argument('--key')

args = parser.parse_args()

token = base64.b64decode(args.token.split('dQw4w9WgXcQ:')[1])
key = base64.b64decode(args.key)[5:]

print(win32crypt.AESModeOfOperationGCM(CryptUnprotectData(key, None, None, None, 0)[1], token[3:15]).decrypt(token[15:])[:-16].decode(errors='ignore'))
