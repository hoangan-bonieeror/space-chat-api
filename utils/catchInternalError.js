module.exports = (response,error) => {
    console.log(error)
    return response.status(500).json({
        code : 500,
        status : 'Internal Error System',
        msg : 'Something went wrong'
    })
}