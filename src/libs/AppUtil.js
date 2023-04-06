class AppUtil {

    static COLORS = [
        "red",
        "red-darken-2",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey",
        "grey"
    ];

    static getUserColor(userId) {
        let seed = 0;
        for (let i=0;i<userId.length;i++) {
            seed += userId.charCodeAt(i);
        }
        return this.COLORS[seed % this.COLORS.length];
    }

}

module.exports = AppUtil;