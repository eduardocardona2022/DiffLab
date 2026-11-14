export const es = {
  'app.title': 'DiffLab — Comparador de texto',
  'app.subtitle': 'Comparador de texto',

  'header.language': 'Idioma',
  'header.theme.toDark': 'Cambiar al tema oscuro',
  'header.theme.toLight': 'Cambiar al tema claro',

  'toolbar.language': 'Lenguaje',
  'toolbar.ignore': 'Ignorar espacios en extremos',
  'toolbar.ignore.hint':
    'No marcar como diferencias los espacios al inicio o al final de cada línea.',
  'toolbar.swap': 'Intercambiar',
  'toolbar.previous': 'Cambio anterior',
  'toolbar.next': 'Cambio siguiente',

  'stats.none': 'Sin cambios',
  'stats.change': '1 cambio',
  'stats.changes': '{count} cambios',
  'stats.addedTitle': 'Líneas añadidas',
  'stats.removedTitle': 'Líneas eliminadas',

  'panel.original': 'Original',
  'panel.modified': 'Modificado',
  'panel.load': 'Cargar archivo',
  'panel.download': 'Descargar texto',
  'panel.loadHint': 'Cargar un archivo de texto (máx. 5 MB)',
  'panel.downloadHint': 'Descargar el contenido de este panel',

  'empty.title': 'Compara dos textos',
  'empty.hint':
    'Pega el contenido o arrastra un archivo a cualquier panel. También puedes cargar uno desde aquí.',
  'empty.loadOriginal': 'Cargar original',
  'empty.loadModified': 'Cargar modificado',

  'drop.original': 'Suelta el archivo en el panel original',
  'drop.modified': 'Suelta el archivo en el panel modificado',
  'drop.hint': 'Se cargará como texto',

  'toast.loaded': 'Archivo cargado: {name}',
  'toast.tooLarge': 'El archivo supera el límite de 5 MB.',
  'toast.binary': 'El archivo parece binario y no se puede comparar como texto.',
  'toast.readError': 'No se pudo leer el archivo.',
  'toast.persistTooLarge':
    'El contenido es demasiado grande para guardarlo en el navegador. Se conservará solo en esta sesión.',
  'toast.persistError': 'No se pudo guardar el estado en el navegador.',
  'toast.dismiss': 'Cerrar aviso',

  'status.lines': '{count} líneas',
  'status.characters': '{count} caracteres',
  'status.privacy': 'Todo se procesa en tu navegador',

  'language.text': 'Texto',
  'language.json': 'JSON',
  'language.sql': 'SQL Server (T-SQL)',
  'language.javascript': 'JavaScript',
  'language.typescript': 'TypeScript',
} as const
