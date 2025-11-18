import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/pages/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// 编码解码工具导入
import Base64Encoder from "./pages/tools/deencode/Base64Encoder";
import UrlEncoder from "./pages/tools/deencode/UrlEncoder";
import AesEncryption from "./pages/tools/deencode/AesEncryption";
import UnicodeEncoder from "./pages/tools/deencode/UnicodeEncoder";
import HexEncoder from "./pages/tools/deencode/HexEncoder";
import Md5Hash from "./pages/tools/deencode/Md5Hash";
import ShaHash from "./pages/tools/deencode/ShaHash";
import AsciiEncoder from "./pages/tools/deencode/AsciiEncoder";
import HtmlEncoder from "./pages/tools/deencode/HtmlEncoder";
import JwtDecoder from "./pages/tools/deencode/JwtDecoder";

// 代码工具导入
import JsonViewer from "./pages/tools/code/JsonViewer";
import JsonToEntity from "./pages/tools/code/JsonToEntity";
import JsonToYaml from "./pages/tools/code/JsonToYaml";
import JsonToCsv from "./pages/tools/code/JsonToCsv";
import CodeFormatter from "./pages/tools/code/CodeFormatter";
import SqlFormatter from "./pages/tools/code/SqlFormatter";
import XmlFormatter from "./pages/tools/code/XmlFormatter";
import CssFormatter from "./pages/tools/code/CssFormatter";
import CodeMinifier from "./pages/tools/code/CodeMinifier";
import ApiTester from "./pages/tools/code/ApiTester";
import CodeConverter from "./pages/tools/code/CodeConverter";
import CodeStats from "./pages/tools/code/CodeStats";
import CommentGenerator from "./pages/tools/code/CommentGenerator";

// 文本工具导入
import TextFormatter from "./pages/tools/text/TextFormatter";
import MarkdownEditor from "./pages/tools/text/MarkdownEditor";
import TextDiff from "./pages/tools/text/TextDiff";
import RegexTester from "./pages/tools/text/RegexTester";

// 转换工具导入
import UnitConverter from "./pages/tools/conversion/UnitConverter";
import ColorConverter from "./pages/tools/conversion/ColorConverter";
import TimestampConverter from "./pages/tools/conversion/TimestampConverter";
import NumberBaseConverter from "./pages/tools/conversion/NumberBaseConverter";

// 日期时间工具导入
import CountdownTimer from "./pages/tools/datetime/CountdownTimer";
import DateCalculator from "./pages/tools/datetime/DateCalculator";
import DateFormatter from "./pages/tools/datetime/DateFormatter";
import DateValidator from "./pages/tools/datetime/DateValidator";
import TimezoneConverter from "./pages/tools/datetime/TimezoneConverter";
import WorkdayCalculator from "./pages/tools/datetime/WorkdayCalculator";

// 生成工具导入
import QrGenerator from "./pages/tools/generator/QrGenerator";
import PasswordGenerator from "./pages/tools/generator/PasswordGenerator";
import UuidGenerator from "./pages/tools/generator/UuidGenerator";
import LoremGenerator from "./pages/tools/generator/LoremGenerator";

// 图像工具导入
import ImageCompressor from "./pages/tools/image/ImageCompressor";
import ImageConverter from "./pages/tools/image/ImageConverter";
import ImageResizer from "./pages/tools/image/ImageResizer";
import ImageCropper from "./pages/tools/image/ImageCropper";

// 网络工具导入
import IpLookup from "./pages/tools/network/IpLookup";
import DnsLookup from "./pages/tools/network/DnsLookup";
import PortScanner from "./pages/tools/network/PortScanner";
import WhoisLookup from "./pages/tools/network/WhoisLookup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* 编码解码工具 */}
              <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
              <Route path="/tools/url-encoder" element={<UrlEncoder />} />
              <Route path="/tools/html-encoder" element={<HtmlEncoder />} />
              <Route path="/tools/unicode-encoder" element={<UnicodeEncoder />} />
              <Route path="/tools/hex-encoder" element={<HexEncoder />} />
              <Route path="/tools/md5-encoder" element={<Md5Hash />} />
              <Route path="/tools/sha-encoder" element={<ShaHash />} />
              <Route path="/tools/jwt-encoder" element={<JwtDecoder />} />
              <Route path="/tools/ascii-encoder" element={<AsciiEncoder />} />
              <Route path="/tools/aes-encryption" element={<AesEncryption />} />
              
              {/* 代码工具 */}
              <Route path="/tools/json-yaml" element={<JsonToYaml />} />
              <Route path="/tools/json-csv" element={<JsonToCsv />} />
              <Route path="/tools/code-formatter" element={<CodeFormatter />} />
              <Route path="/tools/json-viewer" element={<JsonViewer />} />
              <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
              <Route path="/tools/xml-formatter" element={<XmlFormatter />} />
              <Route path="/tools/css-formatter" element={<CssFormatter />} />
              <Route path="/tools/codeminifier" element={<CodeMinifier />} />
              <Route path="/tools/apitester" element={<ApiTester />} />
              <Route path="/tools/code-converter" element={<CodeConverter />} />
              <Route path="/tools/code-stats" element={<CodeStats />} />
              <Route path="/tools/comment-generator" element={<CommentGenerator />} />
              <Route path="/tools/json-to-entity" element={<JsonToEntity />} />
              
              {/* 文本工具 */}
              <Route path="/tools/text-formatter" element={<TextFormatter />} />
              <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
              <Route path="/tools/text-diff" element={<TextDiff />} />
              <Route path="/tools/regex-tester" element={<RegexTester />} />
              
              {/* 转换工具 */}
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/color-converter" element={<ColorConverter />} />
              <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
              <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
              
              {/* 日期时间工具 */}
              <Route path="/tools/countdown-timer" element={<CountdownTimer />} />
              <Route path="/tools/date-calculator" element={<DateCalculator />} />
              <Route path="/tools/date-formatter" element={<DateFormatter />} />
              <Route path="/tools/date-validator" element={<DateValidator />} />
              <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
              <Route path="/tools/workday-calculator" element={<WorkdayCalculator />} />
              
              {/* 生成工具 */}
              <Route path="/tools/qr-generator" element={<QrGenerator />} />
              <Route path="/tools/password-generator" element={<PasswordGenerator />} />
              <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
              <Route path="/tools/lorem-generator" element={<LoremGenerator />} />
              
              {/* 图像工具 */}
              <Route path="/tools/image-compressor" element={<ImageCompressor />} />
              <Route path="/tools/image-converter" element={<ImageConverter />} />
              <Route path="/tools/image-resizer" element={<ImageResizer />} />
              <Route path="/tools/image-cropper" element={<ImageCropper />} />
              
              {/* 网络工具 */}
              <Route path="/tools/ip-lookup" element={<IpLookup />} />
              <Route path="/tools/dns-lookup" element={<DnsLookup />} />
              <Route path="/tools/port-scanner" element={<PortScanner />} />
              <Route path="/tools/whois-lookup" element={<WhoisLookup />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
