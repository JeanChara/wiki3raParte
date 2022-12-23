#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

my $q = CGI->new;
my $nombres = $q->param('Nombre');
my $apellidos = $q->param('Apellido');
my $nombreUsuario = $q->param('usuario');
my $contra = $q->param('password');

# conectamos con la base de datos
my $user= 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die ("No se puede conectar");
my $sth = $dbh->prepare("SELECT * FROM Users WHERE userName=?");

$sth->execute($nombreUsuario);
my @row = $sth->fetchrow_array;
$sth->finish;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if(@row == 0){

    # si no existe el usuario en la base de datos...
    $sth = $dbh->prepare("INSERT INTO Users(userName,password,lastName,firstName) VALUES(?,?,?,?)");
    $sth -> execute($nombreUsuario,$contra,$apellidos,$nombres);
    print "<user>\n";
    print "<owner> $nombreUsuario </owner>\n";
    print "<firstName> $nombres </firstName>\n";
    print "<lastName> $apellidos </lastName>\n";
    print "</user>\n";
}
else {
    print "<user>\n";
    print "<owner> </owner>\n";
    print "<firstName> </firstName>\n";
    print "<lastName> </lastName>\n";
    print "</user>\n";

}
$dbh -> disconnect;
