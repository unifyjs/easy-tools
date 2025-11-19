export interface SEOConfig {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    canonicalUrl?: string;
  }
  
  export const toolSEOConfig: Record<string, SEOConfig> = {
    // 首页
    home: {
      title: "Easy Tools - 免费在线开发者工具集合 | 编码解码、代码格式化、转换工具",
      description: "Easy Tools提供100+免费在线开发者工具，包括Base64编解码、JSON格式化、代码压缩、图片处理、时间转换等实用工具，提升开发效率，无需注册即可使用。",
      keywords: ["在线工具", "开发者工具", "免费工具", "编码解码", "代码格式化", "JSON工具", "Base64", "开发效率", "程序员工具", "web工具"],
      ogTitle: "Easy Tools - 免费在线开发者工具集合",
      ogDescription: "100+免费开发者工具，提升编程效率，无需注册即可使用"
    },
  
    // 编码解码工具
    "base64-encoder": {
      title: "Base64编解码工具 - 在线Base64编码解码 | Easy Tools",
      description: "免费在线Base64编码解码工具，支持文本和文件的Base64编码转换，快速安全，支持批量处理，是开发者必备的编码工具。",
      keywords: ["Base64编码", "Base64解码", "Base64转换", "在线编码", "文件编码", "开发工具", "免费工具"],
      ogTitle: "Base64编解码工具 - 免费在线转换",
      ogDescription: "快速安全的Base64编码解码，支持文本和文件转换"
    },
  
    "url-encoder": {
      title: "URL编解码工具 - 在线URL编码解码 | Easy Tools", 
      description: "免费在线URL编码解码工具，处理URL中的特殊字符，支持中文URL编码，完美解决URL传参问题，开发者必备工具。",
      keywords: ["URL编码", "URL解码", "URL转换", "中文URL", "特殊字符", "网址编码", "开发工具"],
      ogTitle: "URL编解码工具 - 处理URL特殊字符",
      ogDescription: "专业的URL编码解码工具，完美处理中文和特殊字符"
    },
  
    "html-encoder": {
      title: "HTML编解码工具 - HTML实体编码解码 | Easy Tools",
      description: "免费在线HTML编码解码工具，转换HTML特殊字符为实体编码，防止XSS攻击，保护网页安全，支持批量转换。",
      keywords: ["HTML编码", "HTML解码", "HTML实体", "XSS防护", "特殊字符", "网页安全", "开发工具"],
      ogTitle: "HTML编解码工具 - HTML实体转换",
      ogDescription: "安全的HTML编码解码，防止XSS攻击，保护网页安全"
    },
  
    "unicode-encoder": {
      title: "Unicode编解码工具 - Unicode字符编码转换 | Easy Tools",
      description: "免费在线Unicode编码解码工具，支持Unicode字符与普通文本互转，处理多语言字符编码，完美支持中文、日文、韩文等。",
      keywords: ["Unicode编码", "Unicode解码", "字符编码", "多语言", "中文编码", "国际化", "开发工具"],
      ogTitle: "Unicode编解码工具 - 多语言字符转换",
      ogDescription: "专业Unicode编码解码，完美支持多语言字符转换"
    },
  
    "hex-encoder": {
      title: "十六进制编解码工具 - Hex编码转换 | Easy Tools",
      description: "免费在线十六进制编码解码工具，支持文本与Hex格式互转，适用于数据传输、加密解密等场景，简单易用。",
      keywords: ["十六进制编码", "Hex编码", "Hex解码", "进制转换", "数据传输", "加密工具", "开发工具"],
      ogTitle: "十六进制编解码工具 - Hex格式转换",
      ogDescription: "快速的十六进制编码解码，适用于数据传输和加密场景"
    },
  
    "md5-encoder": {
      title: "MD5加密工具 - 在线MD5哈希生成器 | Easy Tools",
      description: "免费在线MD5加密工具，快速生成MD5哈希值，支持文本和文件MD5校验，数据完整性验证的首选工具。",
      keywords: ["MD5加密", "MD5哈希", "MD5生成", "数据校验", "文件校验", "哈希算法", "加密工具"],
      ogTitle: "MD5加密工具 - 哈希值生成器",
      ogDescription: "快速生成MD5哈希值，验证数据完整性"
    },
  
    "sha-encoder": {
      title: "SHA加密工具 - SHA1/SHA256/SHA512哈希生成 | Easy Tools",
      description: "免费在线SHA加密工具，支持SHA1、SHA256、SHA512等多种SHA算法，生成安全哈希值，适用于密码加密和数据校验。",
      keywords: ["SHA加密", "SHA1", "SHA256", "SHA512", "哈希算法", "密码加密", "数据安全", "加密工具"],
      ogTitle: "SHA加密工具 - 多种SHA算法支持",
      ogDescription: "支持SHA1/SHA256/SHA512等多种算法的专业加密工具"
    },
  
    "jwt-encoder": {
      title: "JWT解码工具 - JSON Web Token解析器 | Easy Tools",
      description: "免费在线JWT解码工具，解析JWT Token的Header、Payload和Signature，调试JWT认证的必备工具，支持多种算法。",
      keywords: ["JWT解码", "JWT解析", "JSON Web Token", "Token解析", "JWT调试", "认证工具", "开发工具"],
      ogTitle: "JWT解码工具 - Token解析器",
      ogDescription: "专业的JWT解码工具，快速解析Token内容"
    },
  
    "ascii-encoder": {
      title: "ASCII编解码工具 - ASCII字符转换 | Easy Tools",
      description: "免费在线ASCII编码解码工具，支持ASCII字符与数字编码互转，处理控制字符和特殊符号，编程学习必备。",
      keywords: ["ASCII编码", "ASCII解码", "字符转换", "ASCII表", "控制字符", "编程学习", "开发工具"],
      ogTitle: "ASCII编解码工具 - 字符编码转换",
      ogDescription: "完整的ASCII编码解码，支持所有ASCII字符转换"
    },
  
    "aes-encryption": {
      title: "AES加密解密工具 - 在线AES加密器 | Easy Tools",
      description: "免费在线AES加密解密工具，支持AES-128/192/256位加密，多种加密模式，保护数据安全的专业加密工具。",
      keywords: ["AES加密", "AES解密", "对称加密", "数据加密", "AES-256", "加密算法", "数据安全"],
      ogTitle: "AES加密解密工具 - 专业数据加密",
      ogDescription: "支持多种AES加密模式的专业加密解密工具"
    },
  
    // 代码工具
    "json-viewer": {
      title: "JSON格式化工具 - 在线JSON美化压缩 | Easy Tools",
      description: "免费在线JSON格式化工具，支持JSON美化、压缩、验证和树形展示，程序员调试JSON数据的最佳选择。",
      keywords: ["JSON格式化", "JSON美化", "JSON压缩", "JSON验证", "JSON工具", "代码格式化", "开发工具"],
      ogTitle: "JSON格式化工具 - JSON美化压缩",
      ogDescription: "专业的JSON处理工具，支持格式化、压缩和验证"
    },
  
    "json-to-entity": {
      title: "JSON转实体类工具 - JSON生成Java/C#类 | Easy Tools",
      description: "免费在线JSON转实体类工具，快速将JSON数据转换为Java、C#、TypeScript等语言的实体类代码，提升开发效率。",
      keywords: ["JSON转实体", "JSON转Java", "JSON转C#", "代码生成", "实体类生成", "开发工具", "代码转换"],
      ogTitle: "JSON转实体类 - 代码生成器",
      ogDescription: "快速将JSON转换为各种语言的实体类代码"
    },
  
    "json-yaml": {
      title: "JSON与YAML互转工具 - 在线格式转换 | Easy Tools",
      description: "免费在线JSON与YAML互转工具，支持JSON转YAML、YAML转JSON，配置文件格式转换的最佳选择。",
      keywords: ["JSON转YAML", "YAML转JSON", "配置文件转换", "格式转换", "开发工具", "配置管理"],
      ogTitle: "JSON与YAML互转 - 配置文件转换",
      ogDescription: "专业的JSON和YAML格式互转工具"
    },
  
    "json-csv": {
      title: "JSON转CSV工具 - 在线数据格式转换 | Easy Tools",
      description: "免费在线JSON转CSV工具，将JSON数据快速转换为CSV表格格式，支持数据导出和Excel兼容。",
      keywords: ["JSON转CSV", "数据转换", "CSV导出", "表格转换", "数据处理", "Excel兼容", "开发工具"],
      ogTitle: "JSON转CSV - 数据格式转换",
      ogDescription: "快速将JSON数据转换为CSV表格格式"
    },
  
    "code-formatter": {
      title: "代码格式化工具 - 多语言代码美化 | Easy Tools",
      description: "免费在线代码格式化工具，支持JavaScript、Python、Java、C++等多种编程语言的代码美化和格式化。",
      keywords: ["代码格式化", "代码美化", "JavaScript格式化", "Python格式化", "多语言支持", "开发工具"],
      ogTitle: "代码格式化工具 - 多语言支持",
      ogDescription: "支持多种编程语言的专业代码格式化工具"
    },
  
    "sql-formatter": {
      title: "SQL格式化工具 - 在线SQL美化 | Easy Tools",
      description: "免费在线SQL格式化工具，美化SQL语句，提高SQL代码可读性，支持多种数据库语法。",
      keywords: ["SQL格式化", "SQL美化", "SQL工具", "数据库工具", "SQL语法", "开发工具"],
      ogTitle: "SQL格式化工具 - SQL美化器",
      ogDescription: "专业的SQL格式化工具，提高SQL代码可读性"
    },
  
    "xml-formatter": {
      title: "XML格式化工具 - 在线XML美化 | Easy Tools",
      description: "免费在线XML格式化工具，XML美化、压缩和验证，处理XML文档的专业工具。",
      keywords: ["XML格式化", "XML美化", "XML验证", "XML工具", "文档处理", "开发工具"],
      ogTitle: "XML格式化工具 - XML美化验证",
      ogDescription: "专业的XML处理工具，支持格式化和验证"
    },
  
    "css-formatter": {
      title: "CSS格式化工具 - 在线CSS美化压缩 | Easy Tools",
      description: "免费在线CSS格式化工具，CSS代码美化、压缩和优化，前端开发必备工具。",
      keywords: ["CSS格式化", "CSS美化", "CSS压缩", "CSS优化", "前端工具", "样式表工具", "开发工具"],
      ogTitle: "CSS格式化工具 - CSS美化压缩",
      ogDescription: "专业的CSS处理工具，美化和优化CSS代码"
    },
  
    "codeminifier": {
      title: "代码压缩工具 - JS/CSS/HTML压缩 | Easy Tools",
      description: "免费在线代码压缩工具，压缩JavaScript、CSS、HTML代码，减小文件体积，提升网页加载速度。",
      keywords: ["代码压缩", "JS压缩", "CSS压缩", "HTML压缩", "文件压缩", "性能优化", "前端工具"],
      ogTitle: "代码压缩工具 - 网页性能优化",
      ogDescription: "专业的代码压缩工具，提升网页加载速度"
    },
  
    "apitester": {
      title: "API测试工具 - 在线接口调试 | Easy Tools",
      description: "免费在线API测试工具，支持GET、POST、PUT、DELETE等HTTP请求，接口调试和测试的最佳选择。",
      keywords: ["API测试", "接口测试", "HTTP请求", "接口调试", "REST API", "开发工具", "测试工具"],
      ogTitle: "API测试工具 - 接口调试器",
      ogDescription: "专业的API测试工具，支持各种HTTP请求方法"
    },
  
    "code-converter": {
      title: "代码转换工具 - 多语言代码转换 | Easy Tools",
      description: "免费在线代码转换工具，支持多种编程语言之间的代码转换，提升开发效率。",
      keywords: ["代码转换", "语言转换", "代码翻译", "编程语言", "开发工具", "代码生成"],
      ogTitle: "代码转换工具 - 多语言转换",
      ogDescription: "支持多种编程语言的代码转换工具"
    },
  
    "code-stats": {
      title: "代码统计工具 - 代码行数统计 | Easy Tools",
      description: "免费在线代码统计工具，统计代码行数、字符数、函数数量等，分析代码复杂度。",
      keywords: ["代码统计", "代码行数", "代码分析", "代码复杂度", "开发工具", "项目分析"],
      ogTitle: "代码统计工具 - 代码分析器",
      ogDescription: "专业的代码统计分析工具，了解项目规模"
    },
  
    "comment-generator": {
      title: "注释生成工具 - 自动生成代码注释 | Easy Tools",
      description: "免费在线注释生成工具，自动为代码生成规范的注释文档，提升代码可维护性。",
      keywords: ["注释生成", "代码注释", "文档生成", "代码文档", "开发工具", "代码规范"],
      ogTitle: "注释生成工具 - 代码文档化",
      ogDescription: "自动生成规范的代码注释，提升代码质量"
    },
  
    // 文本工具
    "text-formatter": {
      title: "文本格式化工具 - 在线文本处理 | Easy Tools",
      description: "免费在线文本格式化工具，支持文本大小写转换、去重、排序、统计等多种文本处理功能。",
      keywords: ["文本格式化", "文本处理", "大小写转换", "文本去重", "文本排序", "文本工具"],
      ogTitle: "文本格式化工具 - 文本处理器",
      ogDescription: "多功能文本处理工具，支持各种文本格式化操作"
    },
  
    "markdown-editor": {
      title: "Markdown编辑器 - 在线Markdown编辑 | Easy Tools",
      description: "免费在线Markdown编辑器，实时预览，支持语法高亮，导出HTML/PDF，写作和文档编辑的最佳选择。",
      keywords: ["Markdown编辑器", "Markdown预览", "在线编辑", "文档编辑", "写作工具", "语法高亮"],
      ogTitle: "Markdown编辑器 - 实时预览",
      ogDescription: "专业的Markdown编辑器，支持实时预览和导出"
    },
  
    "text-diff": {
      title: "文本对比工具 - 在线文本差异比较 | Easy Tools",
      description: "免费在线文本对比工具，快速比较两个文本的差异，高亮显示不同之处，代码审查必备工具。",
      keywords: ["文本对比", "文本比较", "差异比较", "代码对比", "文件对比", "开发工具"],
      ogTitle: "文本对比工具 - 差异比较器",
      ogDescription: "快速比较文本差异，高亮显示不同之处"
    },
  
    "regex-tester": {
      title: "正则表达式测试工具 - 在线正则调试 | Easy Tools",
      description: "免费在线正则表达式测试工具，实时测试正则匹配结果，支持多种正则语法，正则学习必备。",
      keywords: ["正则表达式", "正则测试", "正则调试", "正则匹配", "正则工具", "开发工具"],
      ogTitle: "正则表达式测试 - 正则调试器",
      ogDescription: "专业的正则表达式测试工具，实时验证匹配结果"
    },
  
    // 转换工具
    "unit-converter": {
      title: "单位转换工具 - 在线单位换算 | Easy Tools",
      description: "免费在线单位转换工具，支持长度、重量、面积、体积、温度等多种单位换算，精确便捷。",
      keywords: ["单位转换", "单位换算", "长度转换", "重量转换", "温度转换", "计算工具"],
      ogTitle: "单位转换工具 - 多种单位换算",
      ogDescription: "支持多种单位的精确转换工具"
    },
  
    "color-converter": {
      title: "颜色转换工具 - RGB/HEX/HSL颜色转换 | Easy Tools",
      description: "免费在线颜色转换工具，支持RGB、HEX、HSL、CMYK等多种颜色格式互转，设计师必备工具。",
      keywords: ["颜色转换", "RGB转换", "HEX转换", "HSL转换", "颜色工具", "设计工具", "调色板"],
      ogTitle: "颜色转换工具 - 多格式颜色转换",
      ogDescription: "支持多种颜色格式的专业转换工具"
    },
  
    "timestamp-converter": {
      title: "时间戳转换工具 - Unix时间戳转换 | Easy Tools",
      description: "免费在线时间戳转换工具，Unix时间戳与日期时间互转，支持多种时区和格式。",
      keywords: ["时间戳转换", "Unix时间戳", "日期转换", "时间转换", "时区转换", "开发工具"],
      ogTitle: "时间戳转换 - Unix时间戳工具",
      ogDescription: "专业的时间戳转换工具，支持多时区转换"
    },
  
    "number-base-converter": {
      title: "进制转换工具 - 二进制八进制十六进制转换 | Easy Tools",
      description: "免费在线进制转换工具，支持二进制、八进制、十进制、十六进制之间的相互转换。",
      keywords: ["进制转换", "二进制转换", "十六进制转换", "八进制转换", "数制转换", "计算工具"],
      ogTitle: "进制转换工具 - 多进制转换",
      ogDescription: "支持多种进制的快速转换工具"
    },
  
    // 日期时间工具
    "countdown-timer": {
      title: "倒计时工具 - 在线倒计时器 | Easy Tools",
      description: "免费在线倒计时工具，支持自定义倒计时，适用于考试、会议、活动等场景。",
      keywords: ["倒计时", "倒计时器", "计时器", "时间工具", "考试倒计时", "会议计时"],
      ogTitle: "倒计时工具 - 在线计时器",
      ogDescription: "多功能倒计时工具，适用于各种场景"
    },
  
    "date-calculator": {
      title: "日期计算工具 - 日期间隔计算 | Easy Tools",
      description: "免费在线日期计算工具，计算两个日期之间的天数、工作日、周数等，支持日期加减运算。",
      keywords: ["日期计算", "日期间隔", "天数计算", "工作日计算", "日期工具", "时间计算"],
      ogTitle: "日期计算工具 - 日期间隔计算器",
      ogDescription: "专业的日期计算工具，支持多种日期运算"
    },
  
    "date-formatter": {
      title: "日期格式化工具 - 日期格式转换 | Easy Tools",
      description: "免费在线日期格式化工具，支持多种日期格式转换，满足不同系统的日期格式需求。",
      keywords: ["日期格式化", "日期格式转换", "时间格式", "日期工具", "格式转换"],
      ogTitle: "日期格式化 - 日期格式转换器",
      ogDescription: "支持多种日期格式的转换工具"
    },
  
    "date-validator": {
      title: "日期验证工具 - 日期有效性检查 | Easy Tools",
      description: "免费在线日期验证工具，检查日期格式是否正确，验证日期有效性。",
      keywords: ["日期验证", "日期检查", "日期有效性", "日期工具", "格式验证"],
      ogTitle: "日期验证工具 - 日期有效性检查",
      ogDescription: "快速验证日期格式和有效性"
    },
  
    "timezone-converter": {
      title: "时区转换工具 - 世界时区转换 | Easy Tools",
      description: "免费在线时区转换工具，支持全球各时区之间的时间转换，国际业务必备工具。",
      keywords: ["时区转换", "世界时区", "时间转换", "国际时间", "时区工具", "全球时间"],
      ogTitle: "时区转换工具 - 全球时区转换",
      ogDescription: "支持全球时区的专业时间转换工具"
    },
  
    "workday-calculator": {
      title: "工作日计算工具 - 工作日统计 | Easy Tools",
      description: "免费在线工作日计算工具，计算两个日期之间的工作日天数，排除周末和节假日。",
      keywords: ["工作日计算", "工作日统计", "上班天数", "节假日计算", "日期工具", "办公工具"],
      ogTitle: "工作日计算 - 工作日统计器",
      ogDescription: "精确计算工作日天数，排除周末节假日"
    },
  
    // 生成工具
    "qr-generator": {
      title: "二维码生成器 - 在线二维码制作 | Easy Tools",
      description: "免费在线二维码生成器，支持文本、网址、WiFi密码等内容生成二维码，可自定义样式和尺寸。",
      keywords: ["二维码生成", "QR码生成", "二维码制作", "二维码工具", "条码生成", "免费生成器"],
      ogTitle: "二维码生成器 - 免费在线制作",
      ogDescription: "专业的二维码生成工具，支持多种内容和自定义样式"
    },
  
    "qr-decoder": {
      title: "二维码解码器 - 在线二维码识别 | Easy Tools",
      description: "免费在线二维码解码器，快速识别和解析二维码内容，支持图片上传和摄像头扫描。",
      keywords: ["二维码解码", "二维码识别", "QR码解析", "二维码扫描", "条码识别", "图片识别"],
      ogTitle: "二维码解码器 - 在线识别工具",
      ogDescription: "快速识别二维码内容，支持多种输入方式"
    },
  
    "password-generator": {
      title: "密码生成器 - 强密码生成工具 | Easy Tools",
      description: "免费在线密码生成器，生成高强度随机密码，支持自定义长度和字符类型，保护账户安全。",
      keywords: ["密码生成器", "强密码生成", "随机密码", "安全密码", "密码工具", "账户安全"],
      ogTitle: "密码生成器 - 强密码生成工具",
      ogDescription: "生成高强度安全密码，保护账户安全"
    },
  
    "uuid-generator": {
      title: "UUID生成器 - 在线UUID生成 | Easy Tools",
      description: "免费在线UUID生成器，快速生成标准UUID/GUID，支持批量生成，开发者必备工具。",
      keywords: ["UUID生成", "GUID生成", "唯一标识符", "UUID工具", "开发工具", "标识符生成"],
      ogTitle: "UUID生成器 - 唯一标识符生成",
      ogDescription: "快速生成标准UUID，支持批量生成"
    },
  
    "lorem-generator": {
      title: "Lorem文本生成器 - 占位文本生成 | Easy Tools",
      description: "免费在线Lorem文本生成器，生成Lorem ipsum占位文本，网页设计和排版测试必备工具。",
      keywords: ["Lorem生成", "占位文本", "Lorem ipsum", "文本生成", "设计工具", "排版工具"],
      ogTitle: "Lorem文本生成器 - 占位文本工具",
      ogDescription: "专业的Lorem ipsum文本生成工具"
    },
  
    // 图像工具
    "image-compressor": {
      title: "图片压缩工具 - 在线图片压缩 | Easy Tools",
      description: "免费在线图片压缩工具，无损压缩JPG、PNG、WebP等格式图片，减小文件大小，提升网页加载速度。",
      keywords: ["图片压缩", "图像压缩", "照片压缩", "无损压缩", "图片优化", "文件压缩"],
      ogTitle: "图片压缩工具 - 无损压缩",
      ogDescription: "专业的图片压缩工具，保持质量的同时减小文件大小"
    },
  
    "image-converter": {
      title: "图片格式转换 - 在线图片转换 | Easy Tools",
      description: "免费在线图片格式转换工具，支持JPG、PNG、WebP、GIF等多种格式互转，批量转换。",
      keywords: ["图片转换", "图像格式转换", "JPG转PNG", "PNG转JPG", "WebP转换", "格式转换"],
      ogTitle: "图片格式转换 - 多格式支持",
      ogDescription: "支持多种图片格式的专业转换工具"
    },
  
    "image-resizer": {
      title: "图片尺寸调整 - 在线图片缩放 | Easy Tools",
      description: "免费在线图片尺寸调整工具，支持按像素、百分比调整图片大小，保持比例或自定义尺寸。",
      keywords: ["图片调整", "图像缩放", "图片尺寸", "图片大小", "图片编辑", "尺寸修改"],
      ogTitle: "图片尺寸调整 - 在线缩放工具",
      ogDescription: "灵活的图片尺寸调整工具，支持多种调整方式"
    },
  
    "image-cropper": {
      title: "图片裁剪工具 - 在线图片裁切 | Easy Tools",
      description: "免费在线图片裁剪工具，支持自由裁剪、固定比例裁剪，制作头像、封面图的最佳选择。",
      keywords: ["图片裁剪", "图像裁切", "照片裁剪", "头像制作", "图片编辑", "裁切工具"],
      ogTitle: "图片裁剪工具 - 在线裁切编辑",
      ogDescription: "专业的图片裁剪工具，支持多种裁剪方式"
    },
  
    // 网络工具
    "ip-lookup": {
      title: "IP地址查询 - IP归属地查询 | Easy Tools",
      description: "免费在线IP地址查询工具，查询IP归属地、运营商、地理位置等信息，网络诊断必备工具。",
      keywords: ["IP查询", "IP地址查询", "IP归属地", "IP定位", "网络工具", "地理位置"],
      ogTitle: "IP地址查询 - IP归属地查询工具",
      ogDescription: "快速查询IP地址的详细信息和归属地"
    },
  
    "dns-lookup": {
      title: "DNS查询工具 - 域名解析查询 | Easy Tools",
      description: "免费在线DNS查询工具，查询域名的A、AAAA、MX、CNAME等DNS记录，网络管理必备。",
      keywords: ["DNS查询", "域名解析", "DNS记录", "域名查询", "网络工具", "DNS工具"],
      ogTitle: "DNS查询工具 - 域名解析查询",
      ogDescription: "专业的DNS查询工具，支持多种记录类型"
    },
  
    "port-scanner": {
      title: "端口扫描工具 - 在线端口检测 | Easy Tools",
      description: "免费在线端口扫描工具，检测服务器端口开放状态，网络安全检测工具。",
      keywords: ["端口扫描", "端口检测", "网络扫描", "安全检测", "服务器检测", "网络工具"],
      ogTitle: "端口扫描工具 - 网络端口检测",
      ogDescription: "专业的端口扫描工具，检测网络服务状态"
    },
  
    "whois-lookup": {
      title: "Whois查询工具 - 域名信息查询 | Easy Tools",
      description: "免费在线Whois查询工具，查询域名注册信息、到期时间、注册商等详细信息。",
      keywords: ["Whois查询", "域名查询", "域名信息", "注册信息", "域名工具", "网络工具"],
      ogTitle: "Whois查询 - 域名信息查询工具",
      ogDescription: "快速查询域名的详细注册信息"
    },
  
    // AI工具
    "ai-tool-navigator": {
      title: "AI工具导航 - 1000+AI工具集合 | Easy Tools",
      description: "汇集1000+国内外优质AI工具，包含AI写作、图像生成、视频制作、办公助手、聊天机器人等分类导航，发现最新AI应用。",
      keywords: ["AI工具", "人工智能", "AI导航", "AI写作", "AI图像", "AI视频", "ChatGPT", "AI应用"],
      ogTitle: "AI工具导航 - 1000+AI工具集合",
      ogDescription: "发现最新最全的AI工具，提升工作效率"
    }
  };
  
  // 获取工具的SEO配置
  export function getToolSEO(toolId: string): SEOConfig {
    return toolSEOConfig[toolId] || toolSEOConfig.home;
  }
  
  // 生成结构化数据
  export function generateStructuredData(toolId: string, url: string) {
    const seo = getToolSEO(toolId);
    
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": seo.title,
      "description": seo.description,
      "url": url,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "Easy Tools"
      }
    };
  }