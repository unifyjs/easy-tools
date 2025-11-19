#!/bin/bash

# 工具页面SEO优化脚本
# 为所有工具页面添加SEO组件

# 定义工具页面路径和对应的toolId
declare -A TOOLS=(
    # 编码解码工具
    ["src/pages/tools/deencode/UrlEncoder.tsx"]="url-encoder"
    ["src/pages/tools/deencode/HtmlEncoder.tsx"]="html-encoder"
    ["src/pages/tools/deencode/UnicodeEncoder.tsx"]="unicode-encoder"
    ["src/pages/tools/deencode/HexEncoder.tsx"]="hex-encoder"
    ["src/pages/tools/deencode/Md5Hash.tsx"]="md5-encoder"
    ["src/pages/tools/deencode/ShaHash.tsx"]="sha-encoder"
    ["src/pages/tools/deencode/JwtDecoder.tsx"]="jwt-encoder"
    ["src/pages/tools/deencode/AsciiEncoder.tsx"]="ascii-encoder"
    ["src/pages/tools/deencode/AesEncryption.tsx"]="aes-encryption"
    
    # 代码工具
    ["src/pages/tools/code/JsonToEntity.tsx"]="json-to-entity"
    ["src/pages/tools/code/JsonToYaml.tsx"]="json-yaml"
    ["src/pages/tools/code/JsonToCsv.tsx"]="json-csv"
    ["src/pages/tools/code/CodeFormatter.tsx"]="code-formatter"
    ["src/pages/tools/code/SqlFormatter.tsx"]="sql-formatter"
    ["src/pages/tools/code/XmlFormatter.tsx"]="xml-formatter"
    ["src/pages/tools/code/CssFormatter.tsx"]="css-formatter"
    ["src/pages/tools/code/CodeMinifier.tsx"]="codeminifier"
    ["src/pages/tools/code/ApiTester.tsx"]="apitester"
    ["src/pages/tools/code/CodeConverter.tsx"]="code-converter"
    ["src/pages/tools/code/CodeStats.tsx"]="code-stats"
    ["src/pages/tools/code/CommentGenerator.tsx"]="comment-generator"
    
    # 文本工具
    ["src/pages/tools/text/TextFormatter.tsx"]="text-formatter"
    ["src/pages/tools/text/MarkdownEditor.tsx"]="markdown-editor"
    ["src/pages/tools/text/TextDiff.tsx"]="text-diff"
    ["src/pages/tools/text/RegexTester.tsx"]="regex-tester"
    
    # 转换工具
    ["src/pages/tools/conversion/UnitConverter.tsx"]="unit-converter"
    ["src/pages/tools/conversion/ColorConverter.tsx"]="color-converter"
    ["src/pages/tools/conversion/TimestampConverter.tsx"]="timestamp-converter"
    ["src/pages/tools/conversion/NumberBaseConverter.tsx"]="number-base-converter"
    
    # 日期时间工具
    ["src/pages/tools/datetime/CountdownTimer.tsx"]="countdown-timer"
    ["src/pages/tools/datetime/DateCalculator.tsx"]="date-calculator"
    ["src/pages/tools/datetime/DateFormatter.tsx"]="date-formatter"
    ["src/pages/tools/datetime/DateValidator.tsx"]="date-validator"
    ["src/pages/tools/datetime/TimezoneConverter.tsx"]="timezone-converter"
    ["src/pages/tools/datetime/WorkdayCalculator.tsx"]="workday-calculator"
    
    # 生成工具
    ["src/pages/tools/generator/QrGenerator.tsx"]="qr-generator"
    ["src/pages/tools/generator/QrDecoder.tsx"]="qr-decoder"
    ["src/pages/tools/generator/PasswordGenerator.tsx"]="password-generator"
    ["src/pages/tools/generator/UuidGenerator.tsx"]="uuid-generator"
    ["src/pages/tools/generator/LoremGenerator.tsx"]="lorem-generator"
    
    # 图像工具
    ["src/pages/tools/image/ImageCompressor.tsx"]="image-compressor"
    ["src/pages/tools/image/ImageConverter.tsx"]="image-converter"
    ["src/pages/tools/image/ImageResizer.tsx"]="image-resizer"
    ["src/pages/tools/image/ImageCropper.tsx"]="image-cropper"
    
    # 网络工具
    ["src/pages/tools/network/IpLookup.tsx"]="ip-lookup"
    ["src/pages/tools/network/DnsLookup.tsx"]="dns-lookup"
    ["src/pages/tools/network/PortScanner.tsx"]="port-scanner"
    ["src/pages/tools/network/WhoisLookup.tsx"]="whois-lookup"
    
    # AI工具
    ["src/pages/tools/ai/AIToolNavigator.tsx"]="ai-tool-navigator"
)

echo "开始为工具页面添加SEO优化..."

for file_path in "${!TOOLS[@]}"; do
    tool_id="${TOOLS[$file_path]}"
    
    if [ -f "$file_path" ]; then
        echo "处理文件: $file_path (toolId: $tool_id)"
        
        # 检查是否已经导入了SEOHead
        if ! grep -q "import.*SEOHead" "$file_path"; then
            # 添加SEOHead导入
            sed -i '1i import { SEOHead } from '\''@/components/SEOHead'\'';' "$file_path"
            echo "  ✓ 添加SEOHead导入"
        else
            echo "  - SEOHead导入已存在"
        fi
        
        # 检查是否已经添加了SEOHead组件
        if ! grep -q "<SEOHead" "$file_path"; then
            # 在return语句后添加SEOHead组件
            # 这里需要更复杂的逻辑来正确插入
            echo "  ! 需要手动添加SEOHead组件到return语句中"
        else
            echo "  - SEOHead组件已存在"
        fi
        
    else
        echo "文件不存在: $file_path"
    fi
done

echo "SEO优化脚本执行完成！"