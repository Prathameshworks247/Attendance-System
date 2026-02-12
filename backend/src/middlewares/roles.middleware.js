const roleMiddleware = (requiredRole) =>{
    return (req,res,next) =>{
        if (req.user.role !== requiredRole){
        return res.status(403).json({messagse: `Forbidden: Role Required - ${requiredRole}`});
    }
    next();
    };
};

export default roleMiddleware;

