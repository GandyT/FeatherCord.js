class Embed {
    constructor() {
        this.title = "";
        this.color = "";
        this.url = "";
        this.description = "";
        this.fields = [];
        this.thumbnail = { url: "" };
        this.image = { url: "" };
        this.footer = { text: "" };
        this.author = { name: "", icon_url: "" };
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setColor(color) {
        this.color = Number("0x" + color.substr(1));
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setDesc(desc) {
        this.description = desc;
        return this;
    }
    addField(name, value, inline) {
        this.fields.push({ name: name, value: value, inline: inline || false });
        return this;
    }
    setFooter(footer) {
        this.footer.text = footer;
        return this;
    }
    setAuthorName(name) {
        this.author.name = name;
        return this;
    }
    setAuthorIcon(iconurl) {
        this.author.icon_url = iconurl;
        return this;
    }
    setThumbnail(url) {
        this.thumbnail.url = url;
        return this;
    }
    setImage(url) {
        this.image.url = url;
        return this;
    }
    setTimestamp() {
        this.timestamp = new Date();
        return this;
    }
}

module.exports = Embed;