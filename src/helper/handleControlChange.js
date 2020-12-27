const checkRegExp = (key, value, regex, errorSetter) => {
    if(value !== ''){
        return regex.test(value)
            ? errorSetter({
                [key]: false,
            })
            : errorSetter({
                [key]: true,
            })
    }
    return errorSetter({[key]: false});

};
const handleChange = (event, regex, inputSetter, errorSetter) => {
    const { id, value } = event.target;
    inputSetter({ [id]: value });
    checkRegExp(id, value, regex, errorSetter)
};


export {checkRegExp, handleChange};