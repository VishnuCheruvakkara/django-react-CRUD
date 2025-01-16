# your_app/validators.py

import re
from django.core.exceptions import ValidationError

class CustomPasswordValidator:
    def validate(self, password, user=None):
        # Check for at least one letter (either lowercase or uppercase)
        if not re.search(r'[a-zA-Z]', password):
            raise ValidationError('Password must contain at least one letter.')

        # Check for at least one number
        if not re.search(r'\d', password):
            raise ValidationError('Password must contain at least one number.')

        # Check for at least one special character (allow only a few specific ones)
        allowed_special_chars = r'[@$!%*?&]'
        if not re.search(allowed_special_chars, password):
            raise ValidationError('Password must contain at least one special character: @$!%*?&.')

        # Check for no spaces in the password
        if re.search(r'\s', password):
            raise ValidationError('Password cannot contain spaces.')

    def get_help_text(self):
        return 'Your password must contain at least one letter, one number, one special character (@$!%*?&), and no spaces.'
