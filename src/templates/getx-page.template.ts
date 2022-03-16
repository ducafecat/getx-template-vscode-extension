import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";

export function indexTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/index.dart`;
  const template = `library ${snakeCaseName};

export './state.dart';
export './controller.dart';
export './bindings.dart';
export './view.dart';
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function stateTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/state.dart`;
  const template = `import 'package:get/get.dart';

class ${pascalCaseName}State {
  // title
  final _title = "".obs;
  set title(value) => _title.value = value;
  get title => _title.value;
}
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function controllerTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/controller.dart`;
  const template = `import 'package:get/get.dart';

import 'index.dart';

class ${pascalCaseName}Controller extends GetxController {
  ${pascalCaseName}Controller();

  final state = ${pascalCaseName}State();

  // tap
  void handleTap(int index) {
    Get.snackbar(
      "标题",
      "消息",
    );
  }

  /// 在 widget 内存中分配后立即调用。
  @override
  void onInit() {
    super.onInit();
  }

  /// 在 onInit() 之后调用 1 帧。这是进入的理想场所
  @override
  void onReady() {
    super.onReady();
  }

  /// 在 [onDelete] 方法之前调用。
  @override
  void onClose() {
    super.onClose();
  }

  /// dispose 释放内存
  @override
  void dispose() {
    super.dispose();
  }
}
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function bindingsTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/bindings.dart`;
  const template = `import 'package:get/get.dart';

import 'controller.dart';

class ${pascalCaseName}Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${pascalCaseName}Controller>(() => ${pascalCaseName}Controller());
  }
}
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function viewTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/view.dart`;
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'index.dart';
import 'widgets/widgets.dart';

class ${pascalCaseName}Page extends GetView<${pascalCaseName}Controller> {
  const ${pascalCaseName}Page({Key? key}) : super(key: key);

  // 内容页
  Widget _buildView() {
    return const HelloWidget();
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<${pascalCaseName}Controller>(
      builder: (_) {
        return Scaffold(
          appBar: AppBar(title: const Text("${snakeCaseName}")),
          body: SafeArea(
            child: _buildView(),
          ),
        );
      },
    );
  }
}
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function widgetsTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/widgets/widgets.dart`;
  const template = `library widgets;

export './hello.dart';
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}

export function widgetsHelloTemplate(
  pageName: string,
  targetDirectory: string
) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/widgets/hello.dart`;
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../index.dart';

/// hello
class HelloWidget extends GetView<${pascalCaseName}Controller> {
  const HelloWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Obx(() => Text(controller.state.title)),
    );
  }
}
`;

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, template, "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve;
    });
  });
}
