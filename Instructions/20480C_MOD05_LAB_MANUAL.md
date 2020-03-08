## Module 5: Communiquer avec un serveur distant

Partout où un chemin d'accès à un fichier commence par *[Repository Root]*, remplacez-le par le chemin absolu du dossier dans lequel réside le référentiel 20480. Par exemple, si vous avez cloné ou extrait le repository 20480 vers **C:\Users\John Doe\Downloads\20480**, changez le chemin: **[Repository Root]\AllFiles\20480C\Mod02** en **C:\Users\John Doe\Downloads\20480\AllFiles\20480C\Mod03**.

## Lab: Communiquer avec une source de données distante

#### Scenario

Vous avez été invité à modifier la page **Programme** du site Web ContosoConf. Auparavant, les données de session étaient stockées sous forme de tableau codé en dur et le code JavaScript de la page affichait les données de ce tableau. Cependant, les informations de session ne sont pas statiques. Elles peuvent être mises à jour à tout moment par les organisateurs de la conférence et stockées dans une base de données. Un service Web est disponible qui permet de récupérer les données de cette base de données et vous décidez de mettre à jour le code de la page **Programme** pour utiliser ce service Web plutôt que les données codées en dur tel qu'actuellement intégrées dans l'application.

De plus, les organisateurs de la conférence ont demandé s'il était possible pour les participants à la conférence d'indiquer à quelles sessions ils aimeraient participer. Cela permettra aux organisateurs de la conférence de planifier des sessions populaires dans des salles plus grandes. La page **Programme** a été améliorée pour afficher des icônes en forme d'étoile à côté de chaque session. Un participant peut cliquer sur une icône en forme d'étoile pour enregistrer son intérêt pour cette session. Ces informations doivent être enregistrées dans une base de données sur le serveur et vous envoyez ces informations au service Web qui met à jour les données correspondantes dans la base de données.

Pour les sessions populaires, le service Web renvoie le nombre de participants qui l'ont sélectionnée. Vous devrez gérer cette réponse et afficher un message au participant lorsqu'il aura sélectionné une session potentiellement occupée.

#### Objectifs

Après avoir terminé cet atelier, vous pourrez:
1.	Ecrire du Javascript pour retrouver des données depuis une source distante.
2.	Ecrire du Javascripot pour envoyer des données à une source de données distante.
3.	Utilisez la méthode de asynchrone **fetch** pour simplifier le code qui effectue les communications distantes.


### Exercice 1: Retrouver des données

#### Scenario

Dans cet exercice, vous allez récupérer et afficher la liste des sessions provenant d'un service Web. (https://astonconf.azurewebsites.net/api/schedule)

Tout d'abord, vous allez créer une fonction qui construit une requête HTTP pour obtenir des données de session à partir d'une source de données distante exécutée sur un serveur Web. La fonction enverra la demande de manière asynchrone et vous définirez une fonction de rappel  (callback) qui reçoit les données de session lorsque le service Web répond. Les données de session arriveront sous forme  JSON et devront être transofrmée en un objet JavaScript. Vous utiliserez la fonction **displaySchedule** existante pour afficher les sessions sur la page.

Les connexions réseau aux sources distantes et aux serveurs Web ne sont pas totalement fiables. Par conséquent, vous devrez rendre votre code suffisamment robuste pour gérer les erreurs pouvant survenir lors de la réception de données. À des fins de test, une version du service Web qui génère des erreurs est également disponible et vous utiliserez ce service Web pour vérifier les capacités de gestion des erreurs de votre code.

Enfin, vous exécuterez l'application et afficherez la page **Programme** pour vérifier qu'elle affiche correctement la liste des sessions et qu'elle gère également les erreurs correctement.

#### Task 1: Review the Schedule page

1.	Lancez Visual Studio Code. 
2. Ouvrez l'application qui est dans le dossier **[Repository Root]\Allfiles\Mod05\Labfiles\Starter\Exercise 1** .
3.	Ouvrez le fichier Javascript **scripts\pages\schedule.js**. 
4.	Analysez le codeJavaScript. 
- Notez que le tableau précédemment codé en dur qui contenait les données de session (dans la variable **schedule**) a été remplacé par un tableau vide..
- Notez également que la fonction **createSessionElement** a été modifiée pour générer une étoile à côté du titre de la session.
>**Remarque**: L'étoile est un élément de type lien **&lt;a&gt;** qui est mis en forme avec une image d'arrière plan. Pour faire ceci, l'élément **&lt;a&gt;** comprend un attribut de type **class** ayant pour valeur **star** et le fichier **schedule.css** dans le dossier **styles\pages** contient le style de class suivant:
>```css
>        .star {
>            display: inline-block;
>            width: 15px;
>            height: 15px;
>            cursor: pointer;
>            background-image: url(../images/stars.png);
>            background-position: 0 0;
>        }
>```

#### Task 2: Créer la fonction downloadSchedule

1.	Dans le fichier **schedule.js**, touvez le commentaire qui commence par le texte suivant:
```javascript
        // TODO: Create a function called downloadSchedule
```
2.	Créez une fonction nommée **downloadSchedule**. Vous ajouterez du code à cette fonction dans une tâche ultérieur pour obtenir de façon asynchrone, une liste des sessions depuis le web service.

3.	Au seine de cette fonction, définissez une variable nommée **request**, et affectez lui un nouvel objet de tpye **XMLHttpRequest**.

4.	Dans la fonction **downloadSchedule** , ustilisez l'objet **request** pour retrouver les données de façon asynchrone depuis  **http://astonconf.azurewebsites.net/schedule/list** en effectuant une opération de type GET. Il faut appeler la méthode **open()** de l'objet **request**.

5.	Après l'instruction précédente, créez un callback vide qui va gérer la réponse du web service et attachez le à la propriété **onreadystatechange** de l'objet **request**.

6.	Dans le callback, effectuez les opérations suivantes:
- Vérifiez que la propriété **readyState** de l'objet request indqiue que la réponse est complète(Elle doit avoir la valeur **4**).
- Parsez la réponse JSON sen un objet et passez les éléments de cet objet dans la variable **schedule**.
- Appelez le fonction **displaySchedule** pour affichez les sessions sur la page.

7.	Une fois le callback créé, ajoutez une instruction pour envoyer la requête au serveur. Pour cela, utilisez la méthode **send()** de l'objet **request**.

8.    Dans le fichier **schedule.js** appelez la fonction **downloadSchedule** après le code ajoutant un **EventListner**.
```javascript
        track1CheckBox.addEventListener("click", displaySchedule, false);
        track2CheckBox.addEventListener("click", displaySchedule, false);
        list.addEventListener("click", handleListClick, false);

        downloadSchedule();
```

#### Tâche 3: Ajouter un gestionnaire d"'erreur à la fonction downloadSchedule

1.	Dans la fonction de retour **onreadystatechange**, après avoir reçu la réponse (vérifieez que la propriété **readyState** de l'objet **request** possède la valeur **4**), ajoutez le code pour tester le statut de la requête. 
Pour tous les codes autres que 200, l'objet  **response** contient une propriété **message**. Affichez ce message en utilisant la fonction Javascript **alert**.
2.	Gérez également le cas où la source de données renvoie des données JSON invalides qui ne peuvent pas être parsées. Dans ce cas, utilisez la fonction **alert** pour afficher un message générique.

#### Task 4: Test the Schedule page

1.	Exécutez l'application et affichez la page **schedule.htm** pour vérifiez que la liste des sessions s'affiche.
2.	Fermez votre navigateur.
3.	Dans le fichier **schedule.js**, changez l'URL de la requête en  **http://astonconf.azurewebsites.net.schedule/list?fail**, sauvegardez le fichier, et affichez la page **schedule.htm** dans votre navigateur.
 >**Remarque**: L'URL **http://astonconf.azurewebsites.net/schedule/list?fail** génère des erreurs . Vous pouvez l'utiliser pour savoir si votre gestionnaire d'exception fonctionne convenablement.
4.	Exécutez votre application et vérifiez que le message d'erreur  **Service currently unavailable** apparaît bien.
5.	Une fois votre test effectué, fermez votre navigateur et modifiez l'url pour revenir à  **http://astonconf.azurewebsites.net/schedule/list**.

>**Résultat**: Une fois cet exercice achevé, vous avez avez modifié le code de la page  **Schedule** pour afficher la liste des sessions depuis un service web et pour gérer les erreurs qui peuvent intervenir lors de la communication avec un serveur distant.

### Exercice 2: Serialiser et transmettre des données

#### Scenario

Dans cet exercice, vous allez enregistrer les sessions sélectionnées par un participant en transmettant ces données à un service Web. Vous vérifierez également les sessions potentiellement occupées et informerez le participant en conséquence.

Tout d'abord, vous allez créer une fonction qui crée un objet XMLHttpRequest qui publie des données sur un service Web en indiquant la session qu'un utilisateur a sélectionnée. Vous allez coder le contenu de cette requête et définir les en-têtes de demande HTTP de manière appropriée. Ensuite, vous gérerez la réponse et afficherez un message d'avertissement si la réponse indique que le participant a sélectionné une session populaire susceptible d'être occupée.Enfin, vous exécuterez l'application et afficherez la page **Programme** pour vérifier que le message de session occupée s'affiche bien.


#### Tâche 1: Envoyer la requête pour indiquer la session qu'un participant a sélectionnée

1.	Depuis le dossier **[Repository Root]\Allfiles\Mod05\Labfiles\Starter\Exercise 2** ouvrez l'application dans votre IDE.

2.	Dans le fichier **schedule.js**, trouvez la fonction nommée **saveStar**.

3.	Au sein de cette fonction, ajoutez le code pour construire un objet de type **XMLHttpRequest** et faites une requête asynchrone de type vers l'URL suivante:
```javascript
        "astonconf.azurewebsites.net/schedule/star/" + sessionId
```
>**Remarque**: la variable **sessionId** est passée à la fonction **saveStar** en tant que parémètre; elle contient l'id de la session que l'utilisateur a sélectionnée.

4.	Dans la fonction **saveStar**, utilisez la fonction **setRequestHeader** pour paramétrer dans le header de la requête le **Content-Type** comme suit: 
```javascript
        application/x-www-form-urlencoded
```
5.	Utilisez la fonction **Send** pour envoyer une requête avec le body suivant:
 ```javascript
        "starred=" + isStarred
 ```
>**remarque**: Le paramètre **isStarred** qui est passé à la fonction **saveStar** est une valeur booléenne qui indique si le participant a sélectionné la session dans la page **Schedule**.

#### Tâche 2: Gérer la réponse du web service

1.	Dans la fonction **saveStar**, après le code qui crée la requête POST mais avant l'envoie de cette requête, si le participant a sélectionné la session (**isStarred** est à true), créez un callback pour la propriété **onreadystatechange** de l'objet **request** qui réalise les opérations suivantes:
- Si la requête renvoie le statut 200 (OK), parser la réponse en un objet JSON. Cet objet devra posséder un propriété **starCount** (le web service qui envoie la réponse formatte les données de la sorte).
- Si **starCount** est plus grand que 50, affichez le message suivant en utilisant la fonction **alert**:
 ```javascript
        Cette session est très populaire! Pensez à arriver à l'avance pour avoir un siège.
 ```

#### Tâche 3: Tester page Schedule

1.	Exécutez l'application et affichez la page **schedule.htm**.
2.	Cliquez sur l'étoile à coté de la session **New Technologies in Enterprise**.
3.	Vérifiez qu'une alerte est affichée (session populaire).
4.	Cliquez sur l'étoile à coté de la session **Diving in at the deep end with Canvas**.
5.	Vérifiez qu'aucune alerte n'est affichée (Cette sesion est moins populaire).
6.	Fermez votre navigateur.

>**Résultat**: Après avoir achevé cet exercice, vous avez mis à jour la page **Programme** pour envoyer le choix des participants à un web service et pour afficher un message quand une session est populaire.

### Exercice 3: Refactoriser le code à l'aide de la méthode asynchrone fetch.

#### Scenario

Le code existant utilise un objet **XMLHttpRequest**, mais il est trop verbeux. L'objet **XMLHttpRequest** vous oblige également à définir soigneusement les en-têtes HTTP et à coder le contenu de manière appropriée; sinon, les données demandées risquent de ne pas être transmises correctement. Dans cet exercice, vous allez refactoriser le code JavaScript de la page **Programme** pour le rendre plus simple et plus facile à gérer en utilisant la fonction async **fetch()**.

Tout d'abord, vous allez refactoriser la fonction **downloadSchedule** en remplaçant l'utilisation d'un objet **XMLHttpRequest** par un appel à la méthode **fetch**. Ensuite, vous refactorisez la fonction **saveStar()** de manière similaire. L'utilisation de la fonction **fetch()** simplifiera le code en encodant automatiquement le contenu de la demande et en définissant des en-têtes HTTP. Enfin, vous exécuterez l'application et afficherez la page **Programme** pour vérifier qu'elle affiche toujours les sessions et répond aux clics sur les étoiles comme auparavant.


#### Tâche 1: Refactoriser la fonction downloadSchedule.

1.	Ouvrez le dossier **[Repository Root]\Allfiles\Mod05\Labfiles\Starter\Exercise 3**.
2.	Dans le dossier **scripts/pages**, ouvrez le fichier **schedule.js**, refactoriser la fonction**downloadSchedule** afin qu'elle utilise la fonction **fetch()**.
- l'api fectch doit posséder un argument **url** avec pour valeur **https://astonconf.azurewebsites.net/schedule/list**.
- Utilisez **response.json** avec **await** récupérer la réponse json de manière asynchrone; la réponse doit comprendre une propréité nommée **schedule** que vous devez parser et affecter à la variable de type array **schedule**, et enfin appelez la fonction **displaySchedule()**.

- Vérifiez **response.ok** pour gérer les éventuelles erreurs qui pourraient survenir; dans ce cas affichez le message  **La liste de sessions n'est pas disponible**.


#### Tâche 2: Refactoriser la fonction saveStar

1.	Dans le fichier **schedule.js**, refactorisez la fonction**saveStar** afin qu'elle utilise la fonction **fetch()**.
- L'objet **options** doit posséder une propriété **method** avec **POST**comme valeur, une propréité **header** de type **Headers** contenant l'en-tête **Content-Type** et une propriété **body** avec pour valeur **"starred=" + isStarred**.
- l'api fetch doit avoir pour argument **url** l'adresse du web service et un argument **options**.
- Utilisez **response.json** avec **await** pour récupérer la réponse json de façon asynchrone. Vérifiez que la propriété **starCount** dans l'objet response est plus grand que 50, affichez le message **Cette session est vraiment populaire!! N'arrivez pas trop tard pour avoir un siège**.


#### Tâche 3: Tester la page

1.	Affichez dans votre navigateur la **schedule.htm**.
2.	Vérifiez que la liste de sessions s'affcihe convenablement.
3.	Cliquez sur l'étoile à coté de la session **New Technologies in Enterprise**.
4.	Vérifiez qu'une alerte est affichée (session populaire).
5.	Cliquez sur l'étoile à coté de la session **Diving in at the deep end with Canvas**.
6.	Vérifiez qu'aucune alerte n'est affichée (Cette sesion est moins populaire).
7.	Fermez le navigateur.
6.	Dans le fichier **schedule.js**, ajoutez à la fin de l'appel à la fonction **downloadSchedule** le texte suivant **?fail**.
7.	Affichez dans votre navigateur la **schedule.htm**. Vérifiez que le message **Schedule list not available** s'a&ffiche.
8.	fermez votre navigateur.

>**Résultat:** Après avoir terminé cet exercice, vous aurez refactorisé le code JavaScript qui envoie et reçoit des données pour utiliser la méthode asynchrone **fetch**

©
