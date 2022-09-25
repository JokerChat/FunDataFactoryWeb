# 使用onbuild_vue基础镜像
FROM fangchat/node:14.16.1 AS builder
#切换到app工作目录下
WORKDIR /app
# 复制包文件到app目录下
COPY package.json ./
# 执行安装模块命令
RUN npm config set registry https://registry.npm.taobao.org/ && \
    npm install
# 复制当前目录下的所有文件
COPY . ./
# 执行打包命令
RUN npm run build:prod

# 使用nginx镜像为基础镜像
FROM nginx:alpine
# 声明端口80
EXPOSE 80
# 从builder处复制打包好的文件到/usr/share/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html/
# 删除原本的默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 从builder处复制nginx配置文件到/etc/nginx/conf.d/
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/


