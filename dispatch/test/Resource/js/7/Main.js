function longestPalindrome(s) {
    let res = '';
    for (let i = 0; i < s.length; i++) {
        let odd = expandAroundCenter(s, i, i);
        let even = expandAroundCenter(s, i, i + 1);
        let longer = odd.length > even.length ? odd : even;
        if (longer.length > res.length) {
            res = longer;
        }
    }
    return res;
}

function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return s.slice(left + 1, right);
}