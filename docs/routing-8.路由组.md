app目录，嵌套的文件通常可以被映射到URL，你可以标记一个文件作为Router Group来阻止文件被放进路径中。
允许你在不影响URL路径结构的情况下，以逻辑组的形式组织你的路由结构
路由组用于

- 以组的方式阻止路由
- 确保嵌套layouts在同一个路由级别
   - 在同一个路由中创建多个嵌套layouts，包含多个root layouts
   - 在一个公共路由段的子集中添加一个layout
### 转化
一个路由组可以通过用括号抱着一个文件夹的名字来创建** (文件名)**
#### 例子
创建路由而不影响URL，创建一个组来包含相关的路由，括号中的文件名会在URL中被省略，
尽管可以共享同一个路由URL等级，你仍然可以创建一个layout对每一个组生效。
### 创建多个root layouts
要创建多个root layouts，移除顶级的layout.tsx,在每个组里面增加各自的layout.tsx

- 路由组的名称没有特殊的意义，只是为了分组，不影响URL 路径
- 多个路由组不应该有能生成的相同的路径，
- 如果想用多个root layout，那你的顶级page应该在某个组里
- 多个root layout组之间的路由跳转，会导致 全页面刷新 

