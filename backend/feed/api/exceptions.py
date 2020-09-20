from rest_framework.exceptions import APIException

class BadRequestError(APIException):
    '''Собственная ошибка 400'''
    status_code = 400
    def __init__(self, detail):
        self.detail = detail

class NotFoundError(APIException):
    '''Собственная ошибка 404'''
    status_code = 404
    def __init__(self, detail):
        self.detail = detail
