/**
 * Minimal Lambda handler for Terraform sample.
 * Returns ALB-compatible response.
 */
exports.handler = async (event) => {
  return {
    statusCode: 200,
    statusDescription: "200 OK",
    headers: { "Content-Type": ["application/json"] },
    body: JSON.stringify({ message: "OK", timestamp: new Date().toISOString() }),
    isBase64Encoded: false,
  };
};
