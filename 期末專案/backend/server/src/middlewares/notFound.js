export function notFound(req, res) {
    return res.status(404).json({
      success: false,
      message: `Not Found: ${req.method} ${req.originalUrl}`,
      data: null
    });
  }
  
  