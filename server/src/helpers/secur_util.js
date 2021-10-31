
/**
 * @author Pham Minh Huy
 * @description module for checking JSON Object's validity, checking amount of supplied field in JSON Body, checking if there are special characters in field contents 
 */
function JSONlencount(json) {
    var count=0;
    for(var prop in json) {
       if (json.hasOwnProperty(prop)) {
          ++count;
       }
    }
    return count;
 }
function hasSpecChar(str){
    var specChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return !specChar.test(str)
}
function JSONvalidator(jsonbody,expected_length,expected_property){
    var bool=true
    if (JSONlencount(jsonbody)!=expected_length)
    return false
    for (var i=0;i<expected_property.length;i++){
        bool=jsonbody.hasOwnProperty(expected_property[i])
        if (bool == false) return bool
        bool=hasSpecChar(jsonbody[expected_property[i]])
        if (bool == false) return bool
    }
    return bool
}
module.exports= {JSONvalidator,hasSpecChar}
    
    // const keys = Object.keys(jsonbody);
    // for (let i = 0; i < keys.length; ++i) {
    //     bool=hasSpecChar(jsonbody[i]);
    //     console.log(jsonbody[i])
    //     if (bool == false) return bool
    // }

    