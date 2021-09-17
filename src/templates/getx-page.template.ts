import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";
import * as vscode from 'vscode';

const configPascalCaseClassName = 'GetxTemplate.PascalCaseClassName';

export function indexTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  const snakeCaseName = changeCase.snakeCase(pageName);

  var targetPath = `${targetDirectory}/${snakeCaseName}/index.dart`;
  var template = `library ${snakeCaseName};

export './state.dart';
export './controller.dart';
export './bindings.dart';
export './view.dart';
`;

  return new Promise(async (resolve, reject) => {

    if (prefix.trim() !== "") {
     
      targetPath = `${targetDirectory}/${prefix}/${prefix}_index.dart`;
      template = `library ${snakeCaseName};

export './${prefix}_state.dart';
export './${prefix}_controller.dart';
export './${prefix}_bindings.dart';
export './${prefix}_view.dart';
`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function stateTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  var className = pageName;
  const isPascalCaseName = vscode.workspace.getConfiguration().get(configPascalCaseClassName);
  if (isPascalCaseName) {
    className = changeCase.pascalCase(pageName.toLowerCase());
  }

  const snakeCaseName = changeCase.snakeCase(pageName);
  var targetPath = `${targetDirectory}/${snakeCaseName}/state.dart`;
  const template = `import 'package:get/get.dart';

class ${className}State {
  // title
  final _title = "".obs;
  set title(value) => this._title.value = value;
  get title => this._title.value;
}
`;

  return new Promise(async (resolve, reject) => {

    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/${prefix}_state.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function controllerTemplate(pageName: string, prefix: string, targetDirectory: string) {

  var className = pageName;
  const isPascalCaseName = vscode.workspace.getConfiguration().get(configPascalCaseClassName);
  if (isPascalCaseName) {
    className = changeCase.pascalCase(pageName.toLowerCase());
  }

  const snakeCaseName = changeCase.snakeCase(pageName);
  var targetPath = `${targetDirectory}/${snakeCaseName}/controller.dart`;
  if (prefix.trim() !== "") {
    var importIndex = `import '${prefix}_index.dart';`;
  }else {
    var importIndex = `import 'index.dart';`;
  }
  const template = `import 'package:get/get.dart';

${importIndex}

class ${className}Controller extends GetxController {
  ${className}Controller();

  /// 响应式成员变量

  final state = ${className}State();

  /// 成员变量

  /// 事件

  // tap
  void handleTap(int index) {
    Get.snackbar(
      "标题",
      "消息",
    );
  }

  /// 生命周期

  ///在 widget 内存中分配后立即调用。
  ///你可以用它来为控制器初始化 initialize 一些东西。
  @override
  void onInit() {
    super.onInit();
    // new 对象
    // 初始静态数据
  }

  ///在 onInit() 之后调用 1 帧。这是进入的理想场所
  ///导航事件，例如 snackbar、对话框或新route，或
  ///async 异步请求。
  @override
  void onReady() {
    super.onReady();
    // async 拉取数据
  }

  ///在 [onDelete] 方法之前调用。 [onClose] 可能用于
  ///处理控制器使用的资源。就像 closing events 一样，
  ///或在控制器销毁之前的流。
  ///或者处置可能造成一些内存泄漏的对象，
  ///像 TextEditingControllers、AnimationControllers。
  ///将一些数据保存在磁盘上也可能很有用。
  @override
  void onClose() {
    super.onClose();
    // 1 stop & close 关闭对象
    // 2 save 持久化数据
  }

  ///dispose 释放内存
  @override
  void dispose() {
    super.dispose();
    // dispose 释放对象
  }
}
`;

  return new Promise(async (resolve, reject) => {

    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/${prefix}_controller.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function bindingsTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  var className = pageName;
  const isPascalCaseName = vscode.workspace.getConfiguration().get(configPascalCaseClassName);
  if (isPascalCaseName) {
    className = changeCase.pascalCase(pageName.toLowerCase());
  }

  const snakeCaseName = changeCase.snakeCase(pageName);
  
  var targetPath = `${targetDirectory}/${snakeCaseName}/bindings.dart`;
  if (prefix.trim() !== "") {
    var importController = `import '${prefix}_controller.dart';`;
  }else {
    var importController = `import 'controller.dart';`;
  }
  
  const template = `import 'package:get/get.dart';

${importController}

class ${className}Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${className}Controller>(() => ${className}Controller());
  }
}
`;

  return new Promise(async (resolve, reject) => {
    
    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/${prefix}_bindings.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function viewTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  var className = pageName;
  const isPascalCaseName = vscode.workspace.getConfiguration().get(configPascalCaseClassName);
  if (isPascalCaseName) {
    className = changeCase.pascalCase(pageName.toLowerCase());
  }

  const snakeCaseName = changeCase.snakeCase(pageName);
  
  var targetPath = `${targetDirectory}/${snakeCaseName}/view.dart`;
  if (prefix.trim() !== "") {
    var importIndex = `import '${prefix}_index.dart';`;
  }else {
    var importIndex = `import 'index.dart';`;
  }



  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

${importIndex}
import 'widgets/widgets.dart';

class ${className}Page extends GetView<${className}Controller> {
  // 内容页
  Widget _buildView() {
    return ${pageName}MainWidget();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildView(),
    );
  }
}
`;

  return new Promise(async (resolve, reject) => {

    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/${prefix}_view.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function widgetsTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  const snakeCaseName = changeCase.snakeCase(pageName);
  var targetPath = `${targetDirectory}/${snakeCaseName}/widgets/widgets.dart`;

  if (prefix.trim() !== "") {
    var exportFile = `export './${prefix}_main.dart';`;
  }else {
    var exportFile = `export './${snakeCaseName}_main.dart';`;
  }

  const template = `library widgets;

${exportFile}
`;

  return new Promise(async (resolve, reject) => {

    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/widgets/widgets.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}

export function widgetsMainViewTemplate(pageName: string, prefix: string, targetDirectory: string) {
  
  var className = pageName;
  const isPascalCaseName = vscode.workspace.getConfiguration().get(configPascalCaseClassName);
  if (isPascalCaseName) {
    className = changeCase.pascalCase(pageName.toLowerCase());
  }

  const snakeCaseName = changeCase.snakeCase(pageName);
  var targetPath = `${targetDirectory}/${snakeCaseName}/widgets/${snakeCaseName}_main.dart`;
  
  if (prefix.trim() !== "") {
    var importIndex = `import '../${prefix}_index.dart';`;
  }else {
    var importIndex = `import '../index.dart';`;
  }
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

${importIndex}

/// MainView
class ${className}MainWidget extends GetView<${className}Controller> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Obx(() => Text(controller.state.title)),
    );
  }
}
`;

  return new Promise(async (resolve, reject) => {
    
    if (prefix.trim() !== "") {
      targetPath = `${targetDirectory}/${prefix}/widgets/${prefix}_main.dart`;
    }

    writeFile(
      targetPath,
      template,
      "utf8",
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve;
      }
    );
  });
}
