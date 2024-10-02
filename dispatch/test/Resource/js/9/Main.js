function permute(nums) {
    const result = [];
    function backtrack(path = [], used = {}) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        for (let num of nums) {
            if (used[num]) continue;
            path.push(num);
            used[num] = true;
            backtrack(path, used);
            path.pop();
            used[num] = false;
        }
    }
    backtrack();
    return result;
}