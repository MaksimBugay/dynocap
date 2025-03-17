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