const testUserController = (req, res) => {
    try{
        res.status(200).send('<h1>Welcome to food server</h1>');
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Internal server error',    
        });
    }
};

module.exports = {testUserController};