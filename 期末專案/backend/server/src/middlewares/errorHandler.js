export function errorHandler(err, req, res, next) {
    console.error("[ERR]", err);
  
    const status = err.statusCode || 500;
    const msg = err.message || "Internal Server Error";
  
    return res.status(status).json({
      success: false,
      message: msg,
      data: null
    });
  }
  