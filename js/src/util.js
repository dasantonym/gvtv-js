define(function () {
    var s = {
        randomIntegerArray : function (size, offset) {
            var i, n, length, shuffle, result = [];
            for (i = 0; i < size; i++) {
                result[i] = i + offset;
            }
            for (length = size; length;) {
                n = Math.random() * length-- | 0;
                shuffle = result[n];
                result[n] = result[length];
                result[length] = shuffle;
            }
            return result;
        }
    };
    return s;
});
