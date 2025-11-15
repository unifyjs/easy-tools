import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/pages/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// 工具页面导入
import Base64Encoder from "./pages/tools/Base64Encoder";
import CodeFormatter from "./pages/tools/CodeFormatter";
import ColorConverter from "./pages/tools/ColorConverter";
import DnsLookup from "./pages/tools/DnsLookup";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageConverter from "./pages/tools/ImageConverter";
import ImageCropper from "./pages/tools/ImageCropper";
import ImageResizer from "./pages/tools/ImageResizer";
import IpLookup from "./pages/tools/IpLookup";
import JsonViewer from "./pages/tools/JsonViewer";
import LoremGenerator from "./pages/tools/LoremGenerator";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import NumberBaseConverter from "./pages/tools/NumberBaseConverter";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import PortScanner from "./pages/tools/PortScanner";
import QrGenerator from "./pages/tools/QrGenerator";
import RegexTester from "./pages/tools/RegexTester";
import TextDiff from "./pages/tools/TextDiff";
import TextFormatter from "./pages/tools/TextFormatter";
import TimestampConverter from "./pages/tools/TimestampConverter";
import UnitConverter from "./pages/tools/UnitConverter";
import UrlEncoder from "./pages/tools/UrlEncoder";
import UuidGenerator from "./pages/tools/UuidGenerator";
import WhoisLookup from "./pages/tools/WhoisLookup";

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
              
              {/* 代码工具 */}
              <Route path="/tools/code-formatter" element={<CodeFormatter />} />
              <Route path="/tools/json-viewer" element={<JsonViewer />} />
              
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
