class baseController {
    /**
     * @param {Object} res Express response
     * @param {Object} data Data to sendToClient
     * @param {Number} code http resp code
     */
    _send(res, data, code = 200) {
        const result = {
            success: code === 200,
            message: data
        };

        // if (code === 500 && process.env.NODE_ENV === 'production') {
        //     result.data = {};
        // }

        res.status(code).send(result);
    }
}

module.exports = baseController;
