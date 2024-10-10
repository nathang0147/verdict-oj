function merge(intervals) {
    if (intervals.length === 0) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const prev = result[result.length - 1];
        const curr = intervals[i];
        if (prev[1] >= curr[0]) {
            prev[1] = Math.max(prev[1], curr[1]);
        } else {
            result.push(curr);
        }
    }
    return result;
}