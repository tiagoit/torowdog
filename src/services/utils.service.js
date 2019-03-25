function removeAcentos(str) {                        
    str = str.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    str = str.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    str = str.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    str = str.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    str = str.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    str = str.replace(new RegExp('[Ç]','gi'), 'c');
    return str;                 
}

function encode(str) {
    str = str.toLowerCase().trim().replace(/ /g , '-');
    return removeAcentos(str);
}

module.exports.encode = encode;