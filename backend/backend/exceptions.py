from rest_framework.exceptions import APIException

class ForbiddenError(APIException):
    '''Собственная ошибка 403'''
    status_code = 403
    def __init__(self, detail):
        self.detail = detail

class NotFoundError(APIException):
    '''Собственная ошибка 404'''
    status_code = 404
    def __init__(self, detail):
        self.detail = detail