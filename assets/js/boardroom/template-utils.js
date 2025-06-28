// Utility class for loading and rendering templates
class TemplateUtils {
  static templateCache = {};

  static async loadTemplate(path) {
    if (TemplateUtils.templateCache[path]) return TemplateUtils.templateCache[path];
    const res = await fetch(path);
    const text = await res.text();
    TemplateUtils.templateCache[path] = text;
    return text;
  }

  static renderTemplate(template, data) {
    return template.replace(/\[\[(\w+)\]\]/g, (match, key) => {
      return key in data ? data[key] : '';
    });
  }

  static renderLogicBlocks(template, data) {
    // #if
    template = template.replace(/\[\[#if (\w+)\]\]([\s\S]*?)\[\[\/if\]\]/g, (m, key, content) => {
      return data[key] ? content : '';
    });
    // #unless
    template = template.replace(/\[\[#unless (\w+)\]\]([\s\S]*?)\[\[\/unless\]\]/g, (m, key, content) => {
      return !data[key] ? content : '';
    });
    return template;
  }
}

export default TemplateUtils;
