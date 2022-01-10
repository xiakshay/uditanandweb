module.exports = (infFunc) => (req,res,next) => {

    Promise.resolve(infFunc(req,res,next)).catch(next);
};