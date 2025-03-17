# DYNOCAP
An advanced, dynamic CAPTCHA designed to withstand even the most sophisticated solving techniques.

DYNOCAP is unbreakable for AI based resolvers, automated browser emulation and CAPTCHA Farm Services

Protect your website with a strong captcha with a several lines of code

1. add dependency
<script src="https://secure.fileshare.ovh/js/pushca.min.js?v=<?= time(); ?>"></script>

2. Add iframe element with Dynocap on your page


3. Add script block to acquire human token via captcha solving
   
<script>
    const pageId = uuid.v4().toString();

    PushcaClient.onHumanTokenHandler = async function (token) {
        PushcaClient.stopWebSocket();
        document.getElementById("captchaFrame").remove();

        //TODO send pageId and token to your server along with some request
        alert(`"${pageId}", "${token}"`);
        
        location.reload();
    }

    document.getElementById("captchaFrame").src = `https://secure.fileshare.ovh/dynamic-captcha-min.html?page-id=${pageId}`;
    openWsConnection();

    async function openWsConnection() {
        if (!PushcaClient.isOpen()) {
            const pClient = new ClientFilter(
                "SecureFileShare",
                "dynamic-captcha",
                pageId,
                "CAPTCHA_CLIENT"
            );
            await PushcaClient.openWsConnection(
                'wss://secure.fileshare.ovh:31085',
                pClient,
                function (clientObj) {
                    return new ClientFilter(
                        clientObj.workSpaceId,
                        clientObj.accountId,
                        clientObj.deviceId,
                        clientObj.applicationId
                    );
                },
                "cHVzaGNhLWRlbW86RFVIYzhCdnJSbWdpWUpLakkwSDc2cVUzaUljYVAyclE="//if you don't have a valid api key then just pass null
            );
        }
    }
</script>

4. Send pageId and token to your server along with some request


5. Validate human token on your backend server using our http REST endpoint
<script>
async function validateHumanToken(pageId, token) {
    const url = 'https://secure.fileshare.ovh/pushca/dynamic-captcha/validate-human-token';
    const payload = {
        pageId: pageId,
        token: token
    };

    try {
        const response = await fetch(url, {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json' // Specify JSON content type
            },
            body: JSON.stringify(payload) // Convert the payload to JSON
        });

        if (response.ok) {
            const isValid = await response.json(); // Parse the JSON response
            console.log('Validation result:', isValid);
            return 'true' === `${isValid}`;
        } else {
            console.error('Failed to validate human token. Status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error occurred while validating human token:', error);
        return false;
    }
}
</script>



