#Build et lancement de l'application

### Pour lancer l'application en mode développement : 
    npm start

### Pour packager l'appli avant envoi vers le IIS 
    npm run build
    
Il faut ensuite récupérer le contenu du "build" et le cc/cv dans le dossier prévu à cet effet sur le IIS de la VM Madrid.

# Explication des `StatusCode`

`0` || `null` - Archivé

`1` - Archivage demandé

`2` - Consultation demandée

`3` - Destruction demandée

`4` - Remise à l'AD demandée

`5` - Remise au PAL demandée

`6` - 

`7` - 

`8` - 

`9` - 

`10` - 

`11` - En cours de versement au PAL

`12` - En cours de récupération au PAL

`13` - En cours de destruction

`14` - En cours de remise aux AD

`15` - 

`16` - 

`17` - 

`18` - 

`19` - 

`20` - 

`21` - Archivé au PAL

`22` - En consultation par {mail_de_la_personne}

`23` - Détruit

`24` - Archivé aux Archives Départementales




