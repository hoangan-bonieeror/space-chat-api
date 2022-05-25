module.exports = (res,error) => {
    console.log(error)
    return res.json({
        code : 500,
        status : 'Internal Error System',
        msg : 'Something went wrong'
    })
}