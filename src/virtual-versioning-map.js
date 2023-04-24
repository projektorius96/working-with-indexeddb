export default(function(){
    const initVersion = 1;
    return (
        new Map([
            ["v100", initVersion],
            ["v101", initVersion],
            ["v111", initVersion],
            ["v200", (initVersion + 1)],
        ])
    )
}).call()