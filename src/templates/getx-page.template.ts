import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";
import * as vscode from 'vscode';

const configPrefixFileName = 'GetxTemplate.PrefixFileName';

export function indexTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  var targetPath = `${targetDirectory}/${pageName}/index.dart`;
  var template = `library ${snakeCaseName};

export './state.dart';
export './controller.dart';
export './bindings.dart';
export './view.dart';
`;

  return new Promise(async (resolve, reject) => {

    if (isPrefixFileName) {
      targetPath = `${targetDirectory}/${pageName}/${snakeCaseName}_index.dart`;
      template = `library ${snakeCaseName};

export './${snakeCaseName}_state.dart';
export './${snakeCaseName}_controller.dart';
export './${snakeCaseName}_bindings.dart';
export './${snakeCaseName}_view.dart';
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

export function stateTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  var targetPath = `${targetDirectory}/${pageName}/state.dart`;
  const template = `import 'package:get/get.dart';

class ${pascalCaseName}State {
  // title
  final _title = "".obs;
  set title(value) => this._title.value = value;
  get title => this._title.value;
}
`;

  return new Promise(async (resolve, reject) => {

    if (isPrefixFileName) {
      targetPath = `${targetDirectory}/${pageName}/${snakeCaseName}_state.dart`;
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

export function controllerTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  var targetPath = `${targetDirectory}/${pageName}/controller.dart`;
  if (isPrefixFileName) {
    var importIndex = `import '${snakeCaseName}_index.dart';`;
  }else {
    var importIndex = `import 'index.dart';`;
  }
  const template = `import 'package:get/get.dart';

${importIndex}

class ${pascalCaseName}Controller extends GetxController {
  ${pascalCaseName}Controller();

  /// 响应式成员变量

  final state = ${pascalCaseName}State();

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

    if (isPrefixFileName) {
      targetPath = `${targetDirectory}/${pageName}/${snakeCaseName}_controller.dart`;
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

export function bindingsTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  var targetPath = `${targetDirectory}/${pageName}/bindings.dart`;
  if (isPrefixFileName) {
    var importController = `import '${snakeCaseName}_controller.dart';`;
  }else {
    var importController = `import 'controller.dart';`;
  }
  
  const template = `import 'package:get/get.dart';

${importController}

class ${pascalCaseName}Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${pascalCaseName}Controller>(() => ${pascalCaseName}Controller());
  }
}
`;

  return new Promise(async (resolve, reject) => {
    
    if (isPrefixFileName) {
      targetPath = `${targetDirectory}/${pageName}/${snakeCaseName}_bindings.dart`;
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

export function viewTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  var targetPath = `${targetDirectory}/${pageName}/view.dart`;
  if (isPrefixFileName) {
    var importIndex = `import '${snakeCaseName}_index.dart';`;
  }else {
    var importIndex = `import 'index.dart';`;
  }
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

${importIndex}
import 'widgets/widgets.dart';

class ${pascalCaseName}Page extends GetView<${pascalCaseName}Controller> {
  // 内容页
  Widget _buildView() {
    return HelloWidget();
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

    if (isPrefixFileName) {
      targetPath = `${targetDirectory}/${pageName}/${snakeCaseName}_view.dart`;
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

export function widgetsTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const targetPath = `${targetDirectory}/${pageName}/widgets/widgets.dart`;
  const template = `library widgets;

export './hello.dart';
`;

  return new Promise(async (resolve, reject) => {
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

export function widgetsHelloTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName);
  const targetPath = `${targetDirectory}/${pageName}/widgets/hello.dart`;
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  if (isPrefixFileName) {
    var importIndex = `import '../${snakeCaseName}_index.dart';`;
  }else {
    var importIndex = `import '../index.dart';`;
  }
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

${importIndex}

/// hello
class HelloWidget extends GetView<${pascalCaseName}Controller> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Obx(() => Text(controller.state.title)),
    );
  }
}
`;

  return new Promise(async (resolve, reject) => {
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
