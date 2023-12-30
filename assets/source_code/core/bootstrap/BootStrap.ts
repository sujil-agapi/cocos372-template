import { _decorator, Component, DebugMode, Node, tween, Vec3 } from "cc";
import { IBootStrapListener } from "./IBootStrapListener"; // Import the interface
const { ccclass, property } = _decorator;

function getBootstrapListenerComponent(node: Node): IBootStrapListener | null {
  if (node) {
    try {
      const components = node.getComponents(Component);
      console.log("Components:", components); // Debug log

      if (Array.isArray(components)) {
        for (const component of components) {
          if (component && "isTypeOfBootStrapListener" in component) {
            return component as unknown as IBootStrapListener;
          }
        }
      }
    } catch (error) {
      console.error("Error in getBootstrapListenerComponent:", error);
    }
    return null;
  }
  return null;
}

@ccclass("BootStrap")
export class BootStrap extends Component {
  @property([Node])
  private allManagers: Node[] = [];

  onLoad() {
    console.log('bootstrap load');
    this.allManagers.forEach((manager) => {
      const bootstrapListener = getBootstrapListenerComponent(manager);
      bootstrapListener?.initialise();
    });
  }

  start() {
    console.log('bootstrap start');
    this.allManagers.forEach((manager) => {
      const bootstrapListener = getBootstrapListenerComponent(manager);
      bootstrapListener?.resolveDependencies();
    });
  }

  onDestroy() {
    console.log('bootstrap destroy');
    if (this && this.allManagers) {
      this.allManagers.forEach((manager) => {
        if (manager && manager.isValid) {
          console.log("Processing manager:", manager);
          try {
            const bootstrapListener = getBootstrapListenerComponent(manager);
            bootstrapListener?.terminate();
          } catch (error) {
            console.error("Error processing manager:", manager, error);
          }
        } else {
          console.log("Manager is null, undefined, or invalid:", manager);
        }
      });
    }
  }
}
