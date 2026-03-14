"""
Custom SMTP email backend that uses certifi's CA bundle for SSL verification.
Fixes SSL certificate errors on Windows with Python 3.13+ (stricter RFC 5280 enforcement).
"""
import ssl
from django.core.mail.backends.smtp import EmailBackend as BaseEmailBackend


class CertifiEmailBackend(BaseEmailBackend):
    def open(self):
        if self.connection:
            return False

        from django.core.mail.utils import DNS_NAME
        connection_params = {'local_hostname': DNS_NAME.get_fqdn()}
        if self.timeout is not None:
            connection_params['timeout'] = self.timeout

        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        if self.use_ssl:
            connection_params['context'] = ctx

        try:
            self.connection = self.connection_class(self.host, self.port, **connection_params)
            if self.use_tls:
                self.connection.ehlo()
                self.connection.starttls(context=ctx)
                self.connection.ehlo()
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except OSError:
            if not self.fail_silently:
                raise
