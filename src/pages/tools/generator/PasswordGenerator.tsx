import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Copy, RefreshCw, Key, Shield, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharacters: string;
  useCustomOnly: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    customCharacters: '',
    useCustomOnly: false
  });
  const [batchCount, setBatchCount] = useState(5);
  const { toast } = useToast();

  // 字符集定义
  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  // 密码强度评估
  const evaluatePasswordStrength = useCallback((pwd: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    // 长度评分
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else suggestions.push('密码长度至少8位');

    // 字符类型评分
    if (/[a-z]/.test(pwd)) score += 15;
    else suggestions.push('包含小写字母');

    if (/[A-Z]/.test(pwd)) score += 15;
    else suggestions.push('包含大写字母');

    if (/[0-9]/.test(pwd)) score += 15;
    else suggestions.push('包含数字');

    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    else suggestions.push('包含特殊字符');

    // 复杂度评分
    const uniqueChars = new Set(pwd).size;
    if (uniqueChars / pwd.length > 0.7) score += 10;

    // 常见模式检测
    if (!/(.)\1{2,}/.test(pwd)) score += 5; // 无连续重复字符
    if (!/123|abc|qwe/i.test(pwd)) score += 5; // 无常见序列

    let label = '';
    let color = '';

    if (score >= 80) {
      label = '非常强';
      color = 'text-green-600';
    } else if (score >= 60) {
      label = '强';
      color = 'text-blue-600';
    } else if (score >= 40) {
      label = '中等';
      color = 'text-yellow-600';
    } else if (score >= 20) {
      label = '弱';
      color = 'text-orange-600';
    } else {
      label = '非常弱';
      color = 'text-red-600';
    }

    return { score, label, color, suggestions };
  }, []);

  // 生成密码
  const generatePassword = useCallback(() => {
    let charset = '';

    if (options.useCustomOnly && options.customCharacters) {
      charset = options.customCharacters;
    } else {
      if (options.includeUppercase) charset += characterSets.uppercase;
      if (options.includeLowercase) charset += characterSets.lowercase;
      if (options.includeNumbers) charset += characterSets.numbers;
      if (options.includeSymbols) charset += characterSets.symbols;
      if (options.customCharacters) charset += options.customCharacters;
    }

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characterSets.similar.includes(char)).join('');
    }

    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !characterSets.ambiguous.includes(char)).join('');
    }

    if (!charset) {
      toast({
        title: "生成失败",
        description: "请至少选择一种字符类型",
        variant: "destructive",
      });
      return '';
    }

    // 确保密码包含所选的字符类型
    let generatedPassword = '';
    const requiredChars: string[] = [];

    if (!options.useCustomOnly) {
      if (options.includeUppercase) {
        let upperChars = characterSets.uppercase;
        if (options.excludeSimilar) upperChars = upperChars.split('').filter(c => !characterSets.similar.includes(c)).join('');
        if (upperChars) requiredChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
      }
      if (options.includeLowercase) {
        let lowerChars = characterSets.lowercase;
        if (options.excludeSimilar) lowerChars = lowerChars.split('').filter(c => !characterSets.similar.includes(c)).join('');
        if (lowerChars) requiredChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
      }
      if (options.includeNumbers) {
        let numberChars = characterSets.numbers;
        if (options.excludeSimilar) numberChars = numberChars.split('').filter(c => !characterSets.similar.includes(c)).join('');
        if (numberChars) requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
      }
      if (options.includeSymbols) {
        let symbolChars = characterSets.symbols;
        if (options.excludeAmbiguous) symbolChars = symbolChars.split('').filter(c => !characterSets.ambiguous.includes(c)).join('');
        if (symbolChars) requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
      }
    }

    // 生成剩余字符
    const remainingLength = options.length - requiredChars.length;
    for (let i = 0; i < remainingLength; i++) {
      generatedPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // 将必需字符插入随机位置
    const finalPassword = (generatedPassword + requiredChars.join('')).split('').sort(() => Math.random() - 0.5).join('');
    
    return finalPassword.slice(0, options.length);
  }, [options, toast]);

  const handleGenerate = () => {
    const newPassword = generatePassword();
    if (newPassword) {
      setPassword(newPassword);
      toast({
        title: "生成成功",
        description: "新密码已生成",
      });
    }
  };

  const handleBatchGenerate = () => {
    const newPasswords: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      const pwd = generatePassword();
      if (pwd) newPasswords.push(pwd);
    }
    setPasswords(newPasswords);
    toast({
      title: "批量生成成功",
      description: `已生成 ${newPasswords.length} 个密码`,
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "密码已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制密码",
        variant: "destructive",
      });
    }
  };

  const passwordStrength = password ? evaluatePasswordStrength(password) : null;

  const presetConfigs = [
    {
      name: '高安全',
      config: { length: 20, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, excludeSimilar: true, excludeAmbiguous: true }
    },
    {
      name: '标准',
      config: { length: 16, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, excludeSimilar: false, excludeAmbiguous: false }
    },
    {
      name: '简单',
      config: { length: 12, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: false, excludeSimilar: true, excludeAmbiguous: false }
    },
    {
      name: '数字PIN',
      config: { length: 6, includeUppercase: false, includeLowercase: false, includeNumbers: true, includeSymbols: false, excludeSimilar: false, excludeAmbiguous: false }
    }
  ];

  return (
    <>
      <SEOHead toolId="password-generator" />
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：配置选项 */}
          <div className="space-y-6">
            {/* 快速预设 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  快速预设
                </CardTitle>
                <CardDescription>选择预设配置快速生成密码</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {presetConfigs.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => setOptions({ ...options, ...preset.config })}
                      className="h-auto p-3"
                    >
                      <div className="text-center">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-gray-500">{preset.config.length}位</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 密码配置 */}
            <Card>
              <CardHeader>
                <CardTitle>密码配置</CardTitle>
                <CardDescription>自定义密码生成规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 密码长度 */}
                <div>
                  <Label htmlFor="length">密码长度: {options.length}</Label>
                  <Slider
                    id="length"
                    min={4}
                    max={128}
                    step={1}
                    value={[options.length]}
                    onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* 字符类型 */}
                <div className="space-y-3">
                  <Label>字符类型</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={options.includeUppercase}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, includeUppercase: checked as boolean })
                        }
                      />
                      <Label htmlFor="uppercase" className="flex-1">大写字母 (A-Z)</Label>
                      <Badge variant="outline">26个字符</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={options.includeLowercase}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, includeLowercase: checked as boolean })
                        }
                      />
                      <Label htmlFor="lowercase" className="flex-1">小写字母 (a-z)</Label>
                      <Badge variant="outline">26个字符</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={options.includeNumbers}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, includeNumbers: checked as boolean })
                        }
                      />
                      <Label htmlFor="numbers" className="flex-1">数字 (0-9)</Label>
                      <Badge variant="outline">10个字符</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symbols"
                        checked={options.includeSymbols}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, includeSymbols: checked as boolean })
                        }
                      />
                      <Label htmlFor="symbols" className="flex-1">特殊字符 (!@#$%^&*)</Label>
                      <Badge variant="outline">32个字符</Badge>
                    </div>
                  </div>
                </div>

                {/* 排除选项 */}
                <div className="space-y-3">
                  <Label>排除选项</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeSimilar"
                        checked={options.excludeSimilar}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, excludeSimilar: checked as boolean })
                        }
                      />
                      <Label htmlFor="excludeSimilar" className="flex-1">排除相似字符</Label>
                      <Badge variant="secondary">il1Lo0O</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeAmbiguous"
                        checked={options.excludeAmbiguous}
                        onCheckedChange={(checked) => 
                          setOptions({ ...options, excludeAmbiguous: checked as boolean })
                        }
                      />
                      <Label htmlFor="excludeAmbiguous" className="flex-1">排除易混淆字符</Label>
                      <Badge variant="secondary">{}[]()\/'"</Badge>
                    </div>
                  </div>
                </div>

                {/* 自定义字符 */}
                <div className="space-y-3">
                  <Label htmlFor="customChars">自定义字符</Label>
                  <Input
                    id="customChars"
                    placeholder="输入额外的字符..."
                    value={options.customCharacters}
                    onChange={(e) => setOptions({ ...options, customCharacters: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useCustomOnly"
                      checked={options.useCustomOnly}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, useCustomOnly: checked as boolean })
                      }
                    />
                    <Label htmlFor="useCustomOnly" className="text-sm">仅使用自定义字符</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成结果 */}
          <div className="space-y-6">
            {/* 密码生成 */}
            <Card>
              <CardHeader>
                <CardTitle>生成密码</CardTitle>
                <CardDescription>点击生成按钮创建新密码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleGenerate} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    生成密码
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                {password && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        value={password}
                        readOnly
                        type={showPassword ? "text" : "password"}
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => handleCopy(password)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* 密码强度 */}
                    {passwordStrength && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">密码强度</Label>
                          <span className={`text-sm font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <Progress value={passwordStrength.score} className="h-2" />
                        {passwordStrength.suggestions.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>建议改进：</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {passwordStrength.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 批量生成 */}
            <Card>
              <CardHeader>
                <CardTitle>批量生成</CardTitle>
                <CardDescription>一次生成多个密码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="batchCount" className="whitespace-nowrap">生成数量:</Label>
                  <Input
                    id="batchCount"
                    type="number"
                    min="1"
                    max="50"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                  <Button onClick={handleBatchGenerate} className="flex-1">
                    批量生成
                  </Button>
                </div>

                {passwords.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {passwords.map((pwd, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
                        <Input
                          value={pwd}
                          readOnly
                          type={showPassword ? "text" : "password"}
                          className="flex-1 font-mono text-xs h-8"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopy(pwd)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 安全提示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  安全提示
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">密码长度</p>
                    <p>建议使用至少12位字符，更长的密码更安全</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">字符多样性</p>
                    <p>包含大小写字母、数字和特殊字符提高安全性</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">避免重复使用</p>
                    <p>为不同账户使用不同的密码</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">安全存储</p>
                    <p>使用密码管理器安全存储密码</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PasswordGenerator;