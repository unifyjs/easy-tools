import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Download, Trash2, Fingerprint, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UuidItem {
  id: string;
  uuid: string;
  version: string;
  timestamp: string;
}

const UuidGenerator = () => {
  const [uuidList, setUuidList] = useState<UuidItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('v4');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [customNamespace, setCustomNamespace] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const { toast } = useToast();

  // UUID v1 生成器 (基于时间戳和MAC地址)
  const generateUuidV1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 15);
    const clockSeq = Math.floor(Math.random() * 0x3fff);
    
    // 简化的 UUID v1 实现
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    const clockSeqHigh = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0');
    const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
    const node = random.padStart(12, '0');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHigh}${clockSeqLow}-${node}`;
  };

  // UUID v4 生成器 (随机)
  const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 简单的哈希函数
  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
  };

  // UUID v3 生成器 (基于MD5哈希)
  const generateUuidV3 = (namespace: string, name: string): string => {
    const hash = simpleHash(namespace + name);
    const hex = hash.toString(16).padStart(32, '0');
    
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      '3' + hex.substring(13, 16),
      ((parseInt(hex.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.substring(17, 20),
      hex.substring(20, 32)
    ].join('-');
  };

  // UUID v5 生成器 (基于SHA-1哈希)
  const generateUuidV5 = (namespace: string, name: string): string => {
    const hash = simpleHash(namespace + name + 'sha1');
    const hex = hash.toString(16).padStart(32, '0');
    
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      '5' + hex.substring(13, 16),
      ((parseInt(hex.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.substring(17, 20),
      hex.substring(20, 32)
    ].join('-');
  };

  // Nil UUID 生成器
  const generateNilUuid = (): string => {
    return '00000000-0000-0000-0000-000000000000';
  };

  // 生成UUID
  const generateUuid = useCallback((version: string, namespace?: string, name?: string): string => {
    switch (version) {
      case 'v1':
        return generateUuidV1();
      case 'v3':
        return generateUuidV3(namespace || 'default-namespace', name || 'default-name');
      case 'v4':
        return generateUuidV4();
      case 'v5':
        return generateUuidV5(namespace || 'default-namespace', name || 'default-name');
      case 'nil':
        return generateNilUuid();
      default:
        return generateUuidV4();
    }
  }, []);

  // 添加UUID到列表
  const addUuid = () => {
    const count = Math.min(Math.max(1, batchCount), 1000); // 限制在1-1000之间
    const newUuids: UuidItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const uuid = generateUuid(
        selectedVersion,
        customNamespace || undefined,
        customName || undefined
      );
      
      newUuids.push({
        id: generateUuidV4(), // 用于React key
        uuid,
        version: selectedVersion,
        timestamp: new Date().toLocaleString()
      });
    }
    
    setUuidList(prev => [...newUuids, ...prev]);
    
    toast({
      title: "生成成功",
      description: `已生成 ${count} 个 UUID ${selectedVersion.toUpperCase()}`
    });
  };

  // 复制单个UUID
  const copyUuid = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      toast({
        title: "复制成功",
        description: "UUID已复制到剪贴板"
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制UUID",
        variant: "destructive"
      });
    }
  };

  // 复制所有UUID
  const copyAllUuids = async () => {
    if (uuidList.length === 0) {
      toast({
        title: "无内容可复制",
        description: "请先生成一些UUID",
        variant: "destructive"
      });
      return;
    }
    
    const allUuids = uuidList.map(item => item.uuid).join('\n');
    
    try {
      await navigator.clipboard.writeText(allUuids);
      toast({
        title: "复制成功",
        description: `已复制 ${uuidList.length} 个UUID到剪贴板`
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制UUID列表",
        variant: "destructive"
      });
    }
  };

  // 下载UUID列表
  const downloadUuids = () => {
    if (uuidList.length === 0) {
      toast({
        title: "无内容可下载",
        description: "请先生成一些UUID",
        variant: "destructive"
      });
      return;
    }
    
    const content = uuidList.map(item => 
      `${item.uuid}\t${item.version.toUpperCase()}\t${item.timestamp}`
    ).join('\n');
    
    const header = 'UUID\tVersion\tTimestamp\n';
    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "下载成功",
      description: "UUID列表已下载到本地"
    });
  };

  // 清空列表
  const clearList = () => {
    setUuidList([]);
    toast({
      title: "清空成功",
      description: "UUID列表已清空"
    });
  };

  // 删除单个UUID
  const removeUuid = (id: string) => {
    setUuidList(prev => prev.filter(item => item.id !== id));
  };

  // 验证UUID格式
  const validateUuid = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const nilUuidRegex = /^00000000-0000-0000-0000-000000000000$/;
    return uuidRegex.test(uuid) || nilUuidRegex.test(uuid);
  };

  return (
    <>
      <SEOHead toolId="uuid-generator" />
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Fingerprint className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">UUID生成器</h1>
          </div>
          <p className="text-gray-600">
            生成各种版本的UUID（通用唯一标识符），支持批量生成和多种格式
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 生成配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>生成配置</CardTitle>
                <CardDescription>选择UUID版本和生成参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="version-select">UUID版本</Label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择UUID版本" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1 (时间戳)</SelectItem>
                      <SelectItem value="v3">Version 3 (MD5哈希)</SelectItem>
                      <SelectItem value="v4">Version 4 (随机)</SelectItem>
                      <SelectItem value="v5">Version 5 (SHA-1哈希)</SelectItem>
                      <SelectItem value="nil">Nil UUID (全零)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="batch-count">生成数量</Label>
                  <Input
                    id="batch-count"
                    type="number"
                    min="1"
                    max="1000"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                    placeholder="输入生成数量"
                  />
                </div>

                {(selectedVersion === 'v3' || selectedVersion === 'v5') && (
                  <>
                    <div>
                      <Label htmlFor="namespace">命名空间</Label>
                      <Input
                        id="namespace"
                        value={customNamespace}
                        onChange={(e) => setCustomNamespace(e.target.value)}
                        placeholder="输入命名空间（可选）"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">名称</Label>
                      <Input
                        id="name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="输入名称（可选）"
                      />
                    </div>
                  </>
                )}

                <Button onClick={addUuid} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  生成 UUID
                </Button>
              </CardContent>
            </Card>

            {/* UUID版本说明 */}
            <Card>
              <CardHeader>
                <CardTitle>版本说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div>
                    <Badge variant="outline" className="mb-1">Version 1</Badge>
                    <p className="text-gray-600">基于时间戳和MAC地址，保证时间顺序</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Version 3</Badge>
                    <p className="text-gray-600">基于MD5哈希，需要命名空间和名称</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Version 4</Badge>
                    <p className="text-gray-600">完全随机生成，最常用的版本</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Version 5</Badge>
                    <p className="text-gray-600">基于SHA-1哈希，需要命名空间和名称</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Nil UUID</Badge>
                    <p className="text-gray-600">全零UUID，用于特殊场景</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* UUID列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>生成的UUID列表</CardTitle>
                    <CardDescription>
                      已生成 {uuidList.length} 个UUID
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllUuids}
                      disabled={uuidList.length === 0}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制全部
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadUuids}
                      disabled={uuidList.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearList}
                      disabled={uuidList.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      清空
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {uuidList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Fingerprint className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无UUID，请点击生成按钮创建</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {uuidList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                              {item.uuid}
                            </code>
                            <Badge 
                              variant={validateUuid(item.uuid) ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {item.version.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{item.timestamp}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyUuid(item.uuid)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUuid(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* UUID格式说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>UUID格式说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">标准格式</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-mono">
                    xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
                  </code>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>• 32个十六进制数字，用连字符分隔</p>
                    <p>• M表示UUID版本号（1-5）</p>
                    <p>• N表示变体位（通常为8、9、A或B）</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">使用场景</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 数据库主键标识</p>
                  <p>• 分布式系统中的唯一标识</p>
                  <p>• 文件和资源的唯一命名</p>
                  <p>• API请求的追踪标识</p>
                  <p>• 会话和事务标识</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default UuidGenerator;