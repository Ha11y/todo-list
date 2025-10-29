# To-Do List 项目部署指南

## 项目打包

由于这是一个纯静态的前端项目，打包过程相对简单。项目不需要构建步骤，所有文件都可以直接部署。

### 打包步骤

1. **准备文件**
   - 确保以下文件已准备就绪：
     - `index.html` - 主页面
     - `app.js` - JavaScript 逻辑
     - `.gitignore` - Git忽略配置（可选）
     - `README.md` - 项目说明（可选）

2. **压缩文件（可选）**
   你可以将所有文件压缩成一个ZIP文件，方便传输：
   - 在Windows中，选择所有文件，右键点击并选择"发送到" > "压缩(zipped)文件夹"
   - 或使用命令行工具进行压缩

## 部署到服务器

### 方法1：传统Web服务器部署（推荐）

#### Nginx部署

1. **安装Nginx**
   - Ubuntu/Debian: `sudo apt update && sudo apt install nginx`
   - CentOS/RHEL: `sudo yum install nginx`
   - Windows: 从[nginx.org](http://nginx.org/)下载并安装

2. **复制文件到Web根目录**
   - Linux: 将文件复制到 `/var/www/html/` 目录
     ```bash
     sudo cp -r /path/to/your/files/* /var/www/html/
     ```
   - Windows: 将文件复制到Nginx安装目录下的 `html` 文件夹

3. **配置Nginx**（可选，但推荐）
   - 编辑Nginx配置文件：
     - Linux: `sudo nano /etc/nginx/sites-available/default`
     - Windows: 编辑 `conf/nginx.conf`
   
   - 基本配置示例：
     ```nginx
     server {
         listen 80;
         server_name example.com;  # 替换为你的域名
         
         root /var/www/html;
         index index.html;
         
         location / {
             try_files $uri $uri/ =404;
         }
         
         # 添加缓存控制
         location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
             expires 30d;
             add_header Cache-Control "public, no-transform";
         }
     }
     ```

4. **重启Nginx**
   - Linux: `sudo systemctl restart nginx`
   - Windows: 使用任务管理器重启Nginx服务

#### Apache部署

1. **安装Apache**
   - Ubuntu/Debian: `sudo apt update && sudo apt install apache2`
   - CentOS/RHEL: `sudo yum install httpd`
   - Windows: 从[Apache Lounge](https://www.apachelounge.com/)下载并安装

2. **复制文件到Web根目录**
   - Linux: `/var/www/html/`
   - Windows: Apache安装目录下的 `htdocs` 文件夹

3. **重启Apache**
   - Linux: `sudo systemctl restart apache2` 或 `sudo systemctl restart httpd`
   - Windows: 使用服务管理器重启Apache服务

### 方法2：使用GitHub Pages部署

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库

2. **上传文件**
   - 将项目文件上传到仓库中

3. **启用GitHub Pages**
   - 进入仓库设置
   - 找到"Pages"选项
   - 在"Source"部分选择"main"分支
   - 点击"Save"
   - GitHub将提供一个URL，你的应用将在几分钟内通过该URL访问

### 方法3：使用Netlify部署

1. **创建Netlify账户**
   - 访问[Netlify.com](https://www.netlify.com/)并注册账户

2. **部署项目**
   - 点击"New site from Git"
   - 选择GitHub/GitLab/Bitbucket
   - 授权并选择你的仓库
   - 点击"Deploy site"
   - Netlify将自动构建并部署你的应用

### 方法4：使用Vercel部署

1. **创建Vercel账户**
   - 访问[Vercel.com](https://vercel.com/)并注册账户

2. **部署项目**
   - 点击"Import Project"
   - 选择"Import Git Repository"
   - 授权并选择你的仓库
   - 点击"Deploy"
   - Vercel将自动部署你的应用

## 部署后优化

### 1. 启用HTTPS

- **自托管服务器**：
  - 使用Let's Encrypt获取免费SSL证书
  - 对于Nginx，可使用certbot: `sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx`

- **托管服务**：
  - GitHub Pages、Netlify和Vercel都提供免费的HTTPS支持
  - 在设置中启用HTTPS选项

### 2. 性能优化

- **压缩静态资源**
  - 对于Nginx，在配置中启用gzip：
    ```nginx
    gzip on;
    gzip_types text/plain text/css application/javascript image/svg+xml;
    ```

- **设置正确的缓存头**
  - 如上面Nginx配置示例所示，为静态资源设置长期缓存

- **优化JavaScript文件**
  - 考虑使用压缩工具如UglifyJS压缩`app.js`文件

### 3. SEO优化

- 更新`index.html`中的元标签，添加合适的标题、描述和关键词
- 考虑添加Google Analytics等分析工具

## 常见问题排查

### 1. 404错误
- 检查文件路径是否正确
- 确保Web服务器配置中的根目录指向正确的位置

### 2. 资源加载失败
- 检查URL是否正确
- 确保CDN链接可以访问

### 3. 本地存储问题
- 某些浏览器可能限制本地存储的使用，特别是在隐私模式下
- 检查浏览器控制台是否有相关错误

## 扩展建议

如果未来需要扩展此项目，可以考虑：

1. 使用构建工具如Webpack、Vite等进行资源打包和优化
2. 添加后端API以支持多用户和云同步
3. 实现用户认证功能
4. 添加数据备份和导入/导出功能

---

部署完成后，你可以通过配置的域名或IP地址访问你的To-Do List应用！