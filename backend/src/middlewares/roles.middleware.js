const roleMiddleware = (requiredRole) =>{
    return (req,res,next) =>{
        if (req.user.role !== requiredRole){
        return res.status(403).json({messagse: "Forbidden"});
    }
    next();
    };
};

export default roleMiddleware;

