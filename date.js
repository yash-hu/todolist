//jshint esversion:6

module.exports.getDate= function(){
    const today= new Date();
    // var currentDay=today.getDay();
    const option={
        weekday :'long',
        day:'numeric',
        month:'long'
    };
    const day=today.toLocaleDateString('en-us',option);
    return day;
};



module.exports.getDay= function(){
    const today= new Date();
    // var currentDay=today.getDay();
    const option={
        weekday :'long',
    };
    const day=today.toLocaleDateString('en-us',option);
    return day;
};



