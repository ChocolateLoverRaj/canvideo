import postAnyMessageUrl from 'post-any-message'
import type { PluginObj } from '@babel/core'
import {
  stringLiteral,
  Identifier,
  callExpression,
  variableDeclaration,
  variableDeclarator,
  objectPattern,
  objectProperty,
  identifier,
  objectExpression,
  importDeclaration,
  importSpecifier
} from '@babel/types'

console.log(postAnyMessageUrl)

const babelPlugin = (): PluginObj<any> => {
  let encodeIdentifier: Identifier
  return {
    visitor: {
      Program: path => {
        encodeIdentifier = path.scope.generateUidIdentifier('encode')
        path.node.body.unshift(importDeclaration(
          [
            importSpecifier(
              encodeIdentifier,
              identifier('encode')
            )
          ],
          stringLiteral(`${window.location.origin}${postAnyMessageUrl as string}`)))
      },
      ExportDefaultDeclaration: path => {
        const valueIdentifier = path.scope.generateUidIdentifier('value')
        const portsIdentifier = path.scope.generateUidIdentifier('ports')

        path.replaceWithMultiple([
          variableDeclaration(
            'const',
            [
              variableDeclarator(
                objectPattern([
                  objectProperty(identifier('value'), valueIdentifier),
                  objectProperty(identifier('ports'), portsIdentifier)
                ]),
                callExpression(encodeIdentifier, [path.node.declaration as any]))]),
          callExpression(
            identifier('postMessage'), [
              valueIdentifier,
              objectExpression([
                objectProperty(identifier('transfer'), portsIdentifier)
              ])
            ])
        ])
      }
    }
  }
}

export default babelPlugin
