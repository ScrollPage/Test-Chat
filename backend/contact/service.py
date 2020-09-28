import uuid, hashlib

def generate_token(identifier):
    salt = uuid.uuid4().hex + identifier
    return hashlib.sha256(salt.encode('utf-8')).hexdigest()
