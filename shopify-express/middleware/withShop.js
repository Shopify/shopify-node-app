module.exports = function withShop({ redirect } = { redirect: true }) {
  return function verifyRequest(request, response, next) {
    const { query: { shop }, session } = request;

    if (session && session.accessToken) {
      return next();
    }

    if (shop && redirect) {
      return response.redirect(`/auth/shopify?shop=${shop}`);
    }

    if (redirect) {
      return response.redirect('/install')
    }

    return response.status(401).json('Unauthorized');
  };
};
