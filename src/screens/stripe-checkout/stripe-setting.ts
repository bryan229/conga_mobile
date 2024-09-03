export const stripeCheckoutRedirectHTML = (publicKey: string, sessionId: string) => {
    return `
    <html>
      <body>
        <script src="https://js.stripe.com/v3"></script>
        <h1 style="width: 100%; margin-top: 300px; text-align: center; font-size:50px">Loading...</h1>
        <div id="error-message"></div>
        <script>
          (function () {
            var stripe = Stripe('${publicKey}');
            window.onload = function () {
              stripe.redirectToCheckout({
                sessionId: '${sessionId}'
              })
                .then(function (result) {
                  if (result.error) {
                    var displayError = document.getElementById('error-message');
                    displayError.textContent = result.error.message;
                  }
                });
            };
          })();
        </script>
      </body>
    </html>
    `;
};

export default stripeCheckoutRedirectHTML;
