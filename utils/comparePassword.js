const comparePassword = (newPassword, oldPassword) => {
    if(newPassword === oldPassword){
        return true;
    }
    else{
        return false;
    }
}

module.exports = comparePassword;